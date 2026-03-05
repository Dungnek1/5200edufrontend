import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  href?: string;
  size?: number;
}

export function Logo({ variant = 'full', className, href = '/', size }: LogoProps) {
  const logoSrc = '/logo/Logo.svg';

  const { width, height } = size
    ? { width: size, height: size }
    : variant === 'full'
    ? { width: 40, height: 40 }
    : variant === 'text'
    ? { width: 80, height: 26 }
    : { width: 40, height: 40 };

  const hasSizeClass = className?.includes('w-') || className?.includes('h-') || className?.includes('size-');
  const linkStyle: React.CSSProperties = hasSizeClass ? {
    display: 'inline-block',
    lineHeight: 0,
    padding: 0,
    margin: 0,
    position: 'relative',
    zIndex: 1
  } : {
    width: `${width}px`,
    height: `${height}px`,
    display: 'inline-block',
    lineHeight: 0,
    padding: 0,
    margin: 0,
    position: 'relative',
    zIndex: 1
  };

  return (
    <Link 
      href={href} 
      className={cn("inline-block", className)}
      style={linkStyle}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        if (
          clickX < rect.left || 
          clickX > rect.right || 
          clickY < rect.top || 
          clickY > rect.bottom
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Image
        src={logoSrc}
        alt="5200Edu"
        width={width}
        height={height}
        priority
        className={hasSizeClass ? "object-contain w-full h-full" : "object-contain"}
        style={hasSizeClass ? {
          width: 'auto',
          height: 'auto',
          display: 'block',
          padding: 0,
          margin: 0
        } : {
          width: `${width}px`,
          height: `${height}px`,
          display: 'block',
          padding: 0,
          margin: 0
        }}
      />
    </Link>
  );
}
