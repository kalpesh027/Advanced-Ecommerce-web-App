import React from 'react';

const Giftcards = () => {
  return (
    <div className="bg-white text-foreground p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Apana Bazar Gift Card</h1>
        <div className="flex space-x-4">
          <button className="text-primary hover:text-primary-foreground">Buy a Gift Card</button>
          <button className="text-primary hover:text-primary-foreground">Check Gift Card Balance</button>
        </div>
      </div>

      <button className="w-full bg-purple-500 text-secondary-foreground text-white py-2 rounded-md mb-4 hover:bg-purple-600">+ ADD A GIFT CARD</button>

      <div className="bg-card p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Buy a Apana Bazar Gift Card</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button className="text-primary hover:text-primary-foreground border-b-2 border-primary">PERSONAL GIFT CARD</button>
            <button className="text-muted-foreground hover:text-primary">CORPORATE REQUIREMENTS</button>
          </div>
          <span className="text-muted-foreground">Powered by <span className="text-primary">Qwikcilver</span></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-muted-foreground mb-1">Recipient's Name *</label>
            <input type="text" className="w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-muted-foreground mb-1">Recipient's Email *</label>
            <input type="email" className="w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-muted-foreground mb-1">Card Value *</label>
            <div className="flex space-x-2">
              <select className="w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary">
                <option>₹500</option>
                <option>₹1000</option>
                <option>₹2000</option>
              </select>
              <input type="number" className="w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary" placeholder="Custom Amount" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-muted-foreground mb-1">Write a message (Optional)</label>
            <textarea className="w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary" rows="3"></textarea>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <img src="https://placehold.co/300x200?text=Gift+Card+Preview" alt="Gift Card Preview" className="rounded-md shadow-md" />
        </div>

        <div className="mt-4">
          <button className="text-primary hover:text-primary-foreground">+ Buy Another Gift Card</button>
        </div>

        <button className="w-full bg-primary text-primary-foreground py-2 rounded-md mt-4 hover:bg-primary/80">BUY GIFT CARD FOR ₹0</button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">FAQs</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How can I buy a Flipkart Gift Card?</h3>
            <p className="text-muted-foreground">You can purchase a Flipkart Gift Card by following the instructions on this page.</p>
          </div>
          <div>
            <h3 className="font-semibold">How can I redeem my Flipkart Gift Card?</h3>
            <p className="text-muted-foreground">You can redeem your Flipkart Gift Card during the checkout process on Flipkart.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use multiple Gift Cards for a single purchase?</h3>
            <p className="text-muted-foreground">Yes, you can use multiple Gift Cards for a single purchase.</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
        <p className="text-muted-foreground">Please read the terms and conditions carefully before purchasing a Flipkart Gift Card.</p>
      </div>
    </div>
  );
};

export default Giftcards;
