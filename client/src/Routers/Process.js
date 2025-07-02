import React from 'react';

const Process = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <img
          aria-hidden="true"
          alt="under-construction"
          src="https://openui.fly.dev/openui/200x200.svg?text=🚧"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">UNDER CONSTRUCTION</h1>
      <p className="text-center text-muted-foreground mb-6">
        Our website is under construction, but we are ready to go! Special surprise for our subscribers only.
      </p>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <input
          type="email"
          placeholder="Enter a valid email address"
          className="border border-border rounded-lg p-2 mr-2"
        />
        <button className="bg-purple-500 text-white hover:bg-purple-600 text-secondary-foreground hover:bg-secondary/80 p-2 rounded-lg">
          NOTIFY ME
        </button>
      </div>
      <p className="text-muted-foreground">
        Turn on Notification now to get early notification of our launch date!
      </p>
      <p className="text-xs font-bold text-gray-500 mt-4">Stay Connected with @Aapla Bajar</p>
    </div>
  );
};

export default Process;
