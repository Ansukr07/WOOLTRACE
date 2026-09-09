export async function createUpiPayment(transaction) {
  const response = await fetch('/api/payments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', transactionId: transaction.id, amount: transaction.grossValue, method: 'UPI' })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Could not start UPI payment.');
  return body.payment;
}

export async function confirmUpiPayment(paymentId) {
  const response = await fetch('/api/payments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirm', paymentId, method: 'UPI' })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || 'Could not confirm UPI payment.');
  return body.payment;
}
