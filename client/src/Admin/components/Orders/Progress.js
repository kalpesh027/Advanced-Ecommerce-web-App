export default function  ProgressTracker({ steps = [], currentStep = 1, onStepClick }){
    if (!steps.length) {
      return <p>No steps available</p>; // Handle when steps array is empty
    }
  
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  
    return (
      <div className="w-full mt-6">
        <div className="relative flex justify-between">
          {/* Labels */}
          {steps.map((step, index) => (
            <div key={index} className=" text-center">
              <span
                className={`${
                  index <= currentStep - 1 ? 'text-green-600' : 'text-gray-400'
                } text-sm font-medium`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
  
        {/* Progress Bar */}
        <div className="relative w-full mt-2">
          <div className="absolute h-1 w-full bg-gray-300 rounded-full"></div>
          <div
            className="absolute h-1 bg-green-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
  
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-5 h-5 rounded-full flex items-center justify-center mt-[-7px] ${
                  index <= currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => onStepClick(index + 1)}
              >
                {index < currentStep ? (
                  <svg
                    // xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                     
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    className={`${
                      index === currentStep ? 'text-white' : 'text-gray-400'
                    } text-xs`}
                  >
                    {index === currentStep ? '•' : ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  