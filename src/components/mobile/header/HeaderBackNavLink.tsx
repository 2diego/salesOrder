import { Link } from 'react-router-dom';
import { HeaderBackArrowIcon } from './MobileHeaderIcons';

type HeaderBackNavLinkProps = {
  to: string;
  ariaLabel?: string;
};

export function HeaderBackNavLink({ to, ariaLabel = 'Volver' }: HeaderBackNavLinkProps) {
  return (
    <Link to={to} aria-label={ariaLabel} className="header-icon-link">
      <HeaderBackArrowIcon width={24} height={24} />
    </Link>
  );
}
