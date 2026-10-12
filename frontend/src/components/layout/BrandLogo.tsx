import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  wordmarkClassName?: string;
};

export const BrandLogo = ({
  size = 'md',
  className = '',
  wordmarkClassName = '',
}: BrandLogoProps) => {
  const markSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  const wordmarkSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link href="/" aria-label="Ember Edge home" className={`group inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/images/ee-logo.png"
        alt=""
        width={160}
        height={160}
        priority
        className={`${markSize} shrink-0`}
      />
      <span className={`${wordmarkSize} whitespace-nowrap font-black uppercase tracking-tight font-serif text-[#1c1c1c] ${wordmarkClassName}`}>
        EMBER <span className="text-[#e58a2b] transition-colors group-hover:text-[#d97706]">EDGE</span>
      </span>
    </Link>
  );
};
