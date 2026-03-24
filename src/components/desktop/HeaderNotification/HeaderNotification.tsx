import React from 'react';
import './HeaderNotification.css';

interface HeaderNotificationProps {
  count: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  maxCount?: number;
  showZero?: boolean;
}

const HeaderNotification: React.FC<HeaderNotificationProps> = ({
  count,
  variant = 'default',
  maxCount = 99,
  showZero = false
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <div className={`header-notification header-notification--${variant}`}>
      <span className="notification-count">{displayCount}</span>
    </div>
  );
};

export default HeaderNotification;
