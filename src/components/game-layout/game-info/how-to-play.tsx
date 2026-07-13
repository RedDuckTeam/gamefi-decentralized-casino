import { cn } from '@/lib/utils';

export type HowToPlayStep = {
  title: string;
  instructions: string[];
};

const StepIndicator = ({ index }: { index: number }) => (
  <div
    className={cn(
      'relative h-[2px] bg-gradient-to-r from-60% to-60% bg-[length:30px_2px] bg-[position:6px]',
      index ? 'from-[#6a6971]' : 'from-[#9747FF]',
    )}
  >
    <div className="absolute -top-[19px] h-10 w-10 rounded-full border-[14px] border-[#070513] bg-[#9747FF]" />
  </div>
);

const StepNumber = ({ index }: { index: number }) => (
  <div
    className={cn(
      'self-start text-[20px] font-medium tracking-[4px] md:self-auto md:pt-3 lg:text-[36px]',
      index ? 'opacity-40' : '',
    )}
  >
    {`0${index + 1}`}
  </div>
);

const StepCard = ({ step }: { step: HowToPlayStep }) => (
  <div className="flex w-full flex-col gap-2 rounded-[20px] border border-[rgba(255,255,255,0.1)] p-4 md:w-11/12">
    <h5 className="font-[18px] tracking-[0.72px] text-text">{step.title}</h5>
    <ul className="list-disc pl-4">
      {step.instructions.map((instruction, index) => (
        <li
          key={index}
          className="text-[14px] tracking-[0.56px] text-[#A9A8B2]"
        >
          {instruction}
        </li>
      ))}
    </ul>
  </div>
);

export default function HowToPlay({ steps }: { steps: HowToPlayStep[] }) {
  const gridClassName = `grid grid-cols-${steps.length}`;
  return (
    <div className="flex flex-col">
      <h5 className="mb-4 text-center text-[24px] text-text lg:mb-8">
        How to play
      </h5>
      <div className={cn(gridClassName, 'hidden lg:grid')}>
        {steps.map((_, index) => (
          <StepIndicator key={index} index={index} />
        ))}
      </div>
      <div className={cn(gridClassName, 'hidden lg:grid')}>
        {steps.map((_, index) => (
          <StepNumber key={index} index={index} />
        ))}
      </div>
      <div className={cn(gridClassName, 'mt-4 hidden lg:grid')}>
        {steps.map((step, index) => (
          <StepCard key={index} step={step} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-3"
          >
            <StepNumber index={index} />
            <StepCard step={step} />
          </div>
        ))}
      </div>
    </div>
  );
}
