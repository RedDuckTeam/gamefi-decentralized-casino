import { cn } from '@/lib/utils';

import './styles.css';

export default function SlideCard({
  width,
  value,
}: {
  width: number;
  value: number;
}) {
  const thresholds = [100, 50, 25, 10, 4];
  let colorValue = 2;

  for (const threshold of thresholds) {
    if (value >= threshold) {
      colorValue = threshold;
      break;
    }
  }

  return (
    <div
      style={{ minWidth: width }}
      className={cn(
        'flex h-[255px] items-center justify-center rounded-[40px] border-4',
        `card-${colorValue}`,
      )}
    >
      <p className="text-2xl font-bold">{value}x</p>
    </div>
  );
}
