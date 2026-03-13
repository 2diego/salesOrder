import { useEffect, useState } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = () => {
  const getIsDesktop = () =>
    typeof window !== 'undefined'
      ? window.innerWidth >= DESKTOP_BREAKPOINT
      : false;

  const [isDesktop, setIsDesktop] = useState<boolean>(getIsDesktop);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(getIsDesktop());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isDesktop;
};

