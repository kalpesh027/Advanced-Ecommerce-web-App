export const loadRazorpay = (amount, orderId) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay API Key
        amount: amount * 100, // Amount in paise (e.g. 5000 paise = 50 INR)
        currency: 'INR',
        name: 'Your Store',
        description: `Order ID: ${orderId}`,
        order_id: orderId,
        handler: function (response) {
          resolve(true); // Resolve promise on successful payment
        },
        modal: {
          ondismiss: function () {
            reject(false); // Reject promise if payment is dismissed
          },
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };
  