import Razorpay from 'razorpay';
import crypto from 'crypto';

// Create Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to generate unique receipt ID
const generateReceiptId = () => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(4).toString('hex');
  return `receipt_${timestamp}_${randomStr}`;
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (e.g., 100 * 100 = 10000 paise = INR 100)
      currency: currency || 'INR',
      receipt: generateReceiptId(), // Generate unique receipt ID
      payment_capture: 1, // Automatically capture payment
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Some error occurred' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Verify Payment
export const verifyPayment = (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + '|' + payment_id)
    .digest('hex');

  if (generatedSignature === signature) {
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};

// Handle Webhook (Optional)
export const handleWebhook = (req, res) => {
  // Add webhook handling logic here
  res.status(200).json({ status: 'ok' });
};
