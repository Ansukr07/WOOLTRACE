const paymentStore = new Map();

const createReference = () => `KS-UPI-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { action = 'create', transactionId, amount, paymentId, method = 'UPI', utr } = req.body || {};
  if (action === 'create') {
    if (!transactionId || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'transactionId and a positive amount are required.' });
    }
    const id = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const vpa = process.env.UPI_COLLECT_VPA || 'khetsetu@upi';
    const reference = createReference();
    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent('KhetSetu Trade Payment')}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionId)}&tr=${reference}`;
    const intent = { id, transactionId, amount: Number(amount), method, reference, merchantVpa: vpa, upiUri, gateway: process.env.PAYMENT_GATEWAY_PROVIDER || 'DIRECT_UPI', status: 'PENDING' };
    paymentStore.set(id, intent);
    return res.status(201).json({ success: true, payment: intent, mode: 'test' });
  }

  if (action === 'confirm') {
    if (!/^\d{12}$/.test(String(utr || '').trim())) return res.status(400).json({ message: 'A valid 12-digit UPI transaction reference is required.' });
    const payment = paymentStore.get(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment request was not found. Create a new payment request.' });
    const completed = { ...payment, status: 'PAID', reference: String(utr).trim(), upiRequestReference: payment.reference, verification: 'USER_SUBMITTED', paidAt: new Date().toISOString(), method };
    paymentStore.set(paymentId, completed);
    return res.status(200).json({ success: true, payment: completed, mode: 'test' });
  }

  return res.status(400).json({ message: 'Unsupported payment action.' });
}
