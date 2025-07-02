import React from 'react';

const inputClasses = "mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-blue-500 sm:text-sm";
const checkboxClasses = "h-4 w-4 text-primary border-border rounded focus:ring-primary";
const buttonClasses = "w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";

const PanCardForm = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-card-foreground rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">PAN Card Information</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="pan-card-number" className="block text-sm font-medium">PAN Card Number</label>
          <input type="text" id="pan-card-number" name="pan-card-number" className={inputClasses} placeholder="PAN Card Number" />
        </div>
        <div className="mb-4">
          <label htmlFor="full-name" className="block text-sm font-medium">Full Name</label>
          <input type="text" id="full-name" name="full-name" className={inputClasses} placeholder="Full Name" />
        </div>
        <div className="mb-4">
          <label htmlFor="upload-pan-card" className="block text-sm font-medium">Upload PAN Card (Only JPEG file is allowed)</label>
          <input type="file" id="upload-pan-card" name="upload-pan-card" accept=".jpeg" className="mt-1 block w-full text-sm text-muted-foreground border border-border rounded-md cursor-pointer focus:outline-none" />
        </div>
        <div className="mb-4 flex items-start">
          <input type="checkbox" id="declaration" name="declaration" className={checkboxClasses} />
          <label htmlFor="declaration" className="ml-2 block text-xs text-muted-foreground">
            I do hereby declare that PAN furnished/stated above is correct and belongs to me, registered as an account holder with www.Apanabazar.com. I further declare that I shall solely be held responsible for the consequences, in case of any false PAN declaration.
          </label>
        </div>
        <button type="submit" className={buttonClasses}>
          UPLOAD
        </button>
      </form>
      <div className="mt-4">
        <a href="#" className="text-xm text-blue-500 hover:underline">Read Terms & Conditions of PAN Card Information</a>
      </div>
    </div>
  );
};

const Pancard = () => {
  return (
    <div className="p-4">
      <PanCardForm />
    </div>
  );
}

export default Pancard;
