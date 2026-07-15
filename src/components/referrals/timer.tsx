import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

const getNextWednesday = (): Date => {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const daysUntilWednesday = (3 - currentDayOfWeek + 7) % 7 || 7;
  const nextWednesday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + daysUntilWednesday,
  );
  nextWednesday.setHours(0, 0, 0, 0);
  return nextWednesday;
};

const calculateTimeDifference = (targetDate: Date) => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

export const Timer = () => {
  const targetDate = getNextWednesday();

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeDifference(targetDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeDifference(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 lg:justify-start">
      <div
        className={cn(
          'timer-shadow flex h-16 w-16 items-center justify-center rounded-[18px] border-[6px] border-[#9747FF] bg-[#9747FF] text-xl font-semibold sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:text-3xl',
          !timeLeft.days ? 'border-[rgba(7,5,19,1)] bg-[rgba(7,5,19,1)]' : '',
        )}
      >
        {timeLeft.days}d{' '}
      </div>
      <div
        className={cn(
          'timer-shadow flex h-16 w-16 items-center justify-center rounded-[18px] border-[6px] border-[#9747FF] bg-[#9747FF] text-xl font-semibold sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:text-3xl',
          !timeLeft.days && !timeLeft.hours
            ? 'border-[rgba(7,5,19,1)] bg-[rgba(7,5,19,1)]'
            : '',
        )}
      >
        {timeLeft.hours}h{' '}
      </div>
      <div
        className={cn(
          'timer-shadow flex h-16 w-16 items-center justify-center rounded-[18px] border-[6px] border-[#9747FF] bg-[#9747FF] text-xl font-semibold sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:text-3xl',
          !timeLeft.days && !timeLeft.hours && !timeLeft.minutes
            ? 'border-[rgba(7,5,19,1)] bg-[rgba(7,5,19,1)]'
            : '',
        )}
      >
        {timeLeft.minutes}m{' '}
      </div>
      <div
        className={cn(
          'timer-shadow flex h-16 w-16 items-center justify-center rounded-[18px] border-[6px] border-[#9747FF] bg-[#9747FF] text-xl font-semibold sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:text-3xl',
          !timeLeft.days && !timeLeft.hours && !timeLeft.minutes
            ? 'border-[rgba(250,49,95,1)] bg-[rgba(250,49,95,1)]'
            : '',
        )}
      >
        {timeLeft.seconds}s
      </div>
    </div>
  );
};
