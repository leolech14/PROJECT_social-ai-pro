import React, { useState } from 'react';
import './ButtonWithHover.css';

interface ButtonWithHoverProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  ariaLabel?: string;
}

export const ButtonWithHover: React.FC<ButtonWithHoverProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ariaLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${isHovered ? 'btn-hover' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <span className="btn-content">{children}</span>
      {isHovered && !disabled && (
        <span className="btn-hover-effect" aria-hidden="true" />
      )}
    </button>
  );
};

// Compound component pattern for flexibility
ButtonWithHover.displayName = 'ButtonWithHover';

export default ButtonWithHover;