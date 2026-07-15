import { cn } from '@/lib/utils';

export default function GameDescription({
  image,
  imagePadding,
  alt,
  description,
}: {
  image: string;
  imagePadding?: boolean;
  alt: string;
  description: string[];
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div
        className={cn(
          'flex basis-1/2 items-center justify-center',
          imagePadding ? 'px-6' : '',
        )}
      >
        <img className="max-w-[200px]" src={image} alt={alt} />
      </div>
      <div className="flex flex-col gap-3">
        {description.map((row, index) => (
          <p key={index} className="text-sm tracking-[0.56px] text-text">
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}
