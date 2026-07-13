import { cva } from 'class-variance-authority';

export const buttonVariants = cva('', {
  variants: {
    colors: {
      primary:
        'bg-[#9747FF] border-[#9747FF] text-[#F1F1F1] disabled:text-[#F1F1F199] disabled:bg-[#9747FF99] hover:bg-purple/90',
      secondary: 'bg-[#F1F1F1] border-[#F1F1F1] text-[#070513]',
      inactive: 'bg-[#272B3F] border-[#F1F1F1] text-[#F1F1F1]',
    },
    variant: {
      contained: '',
      outlined: 'bg-inherit border-[1px] text-[#F1F1F1]',
    },
    size: {
      sm: 'px-[12px] py-[4px] text-[14px] rounded-[12px]',
      md: 'px-[24px] py-[12px] text-[16px] rounded-[32px]',
      lg: 'px-[24px] py-[16px] text-[16px] rounded-[32px]',
    },
    weight: {
      600: 'font-semibold',
    },
  },
  defaultVariants: {
    variant: 'contained',
    weight: 600,
    size: 'md',
    colors: 'primary',
  },
});
