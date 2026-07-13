import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useSidebarStore } from '@/components/sidebar/useSidebarStore.ts';
import { cn } from '@/lib/utils';

export default function NavbarItem({
  label,
  url,
  icon,
  iconSize = 'default',
  disabled,
}: {
  label: string;
  url: string;
  icon: string;
  iconSize?: 'small' | 'default';
  disabled?: boolean;
}) {
  const { pathname } = useLocation();

  const linkClassNames = cn(
    'flex items-center gap-3 rounded-[35px] px-3 py-2 transition-colors hover:bg-[#383f60]',
    pathname === url ? 'bg-[#22263a]' : 'bg-transparent',
  );

  const imgClassNames = cn(
    iconSize === 'small' ? 'ml-1.5 h-4 w-4' : 'h-8 w-8 object-contain',
  );

  const { setOpen } = useSidebarStore();

  return (
    <Link
      onClick={(e) => {
        if (disabled) return e.preventDefault();
        setOpen(false);
      }}
      to={url}
      className={linkClassNames}
    >
      <img className={imgClassNames} src={icon} alt={label} />
      <span className={cn('text-sm text-text', disabled && 'text-gray-500')}>
        {label}
      </span>
    </Link>
  );
}
