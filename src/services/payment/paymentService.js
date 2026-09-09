const localPayments = new Map();
const reference = () => `KS-UPI-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

function makeOfflineIntent(transaction) {
  const id = `LOCAL-PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const transactionReference = reference();
  const amount = Number(transaction.grossValue);
  const merchantVpa = import.meta.env.VITE_UPI_ID || 'khetsetu@upi';
  const merchantName = import.meta.env.VITE_UPI_NAME || 'KhetSetu Trade Payment';
  const upiUri = `upi://pay?pa=${encodeURIComponent(merchantVpa)}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${transaction.transactionNumber || transaction.id}`)}&tr=${transactionReference}`;
  const payment = { id, transactionId: transaction.id, amount, method: 'UPI', reference: transactionReference, merchantVpa, upiUri, gateway: 'DIRECT_UPI', status: 'PENDING', offline: true };
  localPayments.set(id, payment);
  return payment;
}

export async function createUpiPayment(transaction) {
  try {
    const response = await fetch('/api/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', transactionId: transaction.id, amount: transaction.grossValue, method: 'UPI' })
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok && body.payment) return body.payment;
  } catch (_error) {
    // The QR payment experience must remain usable when a static dev server
    // has not mounted the optional API bridge.
  }
  return makeOfflineIntent(transaction);
}

export async function confirmUpiPayment(paymentId, utr) {
  const cleanUtr = String(utr || '').trim();
  if (!/^\d{12}$/.test(cleanUtr)) throw new Error('Enter the 12-digit UPI transaction reference (UTR).');
  const localPayment = localPayments.get(paymentId);
  if (localPayment) {
    const paid = { ...localPayment, status: 'PAID', reference: cleanUtr, upiRequestReference: localPayment.reference, verification: 'USER_SUBMITTED', paidAt: new Date().toISOString() };
    localPayments.set(paymentId, paid);
    return paid;
  }
  const response = await fetch('/api/payments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirm', paymentId, method: 'UPI', utr: cleanUtr })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.payment) throw new Error(body.message || 'Could not confirm UPI payment.');
  return body.payment;
}
