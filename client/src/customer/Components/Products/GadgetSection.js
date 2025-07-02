import React from 'react';
import Gadgets from './Gadget';
import OtherComponent from './OtherComponent';

const GadgetSection = ({ section1title,section2title,advertisements, status }) => {
  return (
    <div className="sm:m-1 sm:p-2 flex flex-col space-y-4">
      <div className="w-full p-0 sm:p-3">
        <Gadgets section1title={section1title} advertisements={advertisements} status={status} />
      </div>
      <div className="w-full p-0 sm:p-3">
        <OtherComponent section2title={section2title} advertisements={advertisements} status={status} />
      </div>
    </div>
  );
};

export default GadgetSection;
