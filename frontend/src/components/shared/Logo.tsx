import Image from 'next/image';

interface LogoProps {
  variant?: 'header' | 'auth';
  className?: string;
}

export function Logo({ variant = 'header', className = '' }: LogoProps) {
  const isAuth = variant === 'auth';

  return (
    <div
      className={`relative ${isAuth ? 'h-20 w-[120px] p-3 rounded-xl bg-background/90 backdrop-blur-sm shadow-lg' : 'h-20 w-[120px]'} ${className}`}
    >
      <Image
        src="https://res.cloudinary.com/dzz94crx8/image/upload/v1766820190/GearGuard_finle_logo_bi9qdu.png"
        alt="GearGuard Logo"
        fill
        className={`object-contain ${isAuth ? 'p-1' : ''}`}
        priority
      />
    </div>
  );
}
