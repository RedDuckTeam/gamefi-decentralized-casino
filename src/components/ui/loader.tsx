import SvgLoader from '@/components//ui/svg/spinning-circles.svg';

export const Loader = () => {
  return (
    <img className="mx-auto mt-32 h-16 w-auto" src={SvgLoader} alt="loader" />
  );
};
