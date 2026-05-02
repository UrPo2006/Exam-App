interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="w-full flex items-center justify-center mb-8">
      <div className="flex items-center w-full  relative">
        
        {/* الخط الرمادي الأساسي */}
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-blue-300 -translate-y-1/2 " />
        
        {/* الخط الأزرق (المسافة المقطوعة) */}
        <div 
          className="absolute top-1/2 left-0  border-t-2 border-blue-600 -translate-y-1/2 transition-all duration-500 "
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between w-full relative z-10">
          {steps.map((step) => (

            <div key={step} className="relative flex items-center justify-center bg-white px-2">
            
            <div
              
              className={`w-3 h-3 rotate-45  border-2 transition-all duration-300 relative ${
                step <= currentStep 
                  ? "bg-blue-600 border-blue-600" 
                  : "bg-white border-blue-400"
              }`}
            >
                       {/* background  */}
               {step === currentStep && (
                 <div className="absolute inset-[-12px] border-8 border-blue-100 " />
               )}
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}