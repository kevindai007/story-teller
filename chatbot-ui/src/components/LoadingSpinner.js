import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'loading-spinner--small',
    medium: 'loading-spinner--medium',
    large: 'loading-spinner--large',
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <FaSpinner className="spinner-icon" />
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
