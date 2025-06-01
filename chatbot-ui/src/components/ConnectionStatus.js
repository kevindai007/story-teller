import React, { useState, useEffect } from 'react';
import { FaWifi, FaWifiOff } from 'react-icons/fa';

const ConnectionStatus = ({ apiBaseUrl }) => {
  const [status, setStatus] = useState('connecting');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    let intervalId;
    
    const checkConnection = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          method: 'GET',
          timeout: 5000,
        });
        
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
      
      setLastChecked(new Date());
    };

    // Initial check
    checkConnection();
    
    // Check every 30 seconds
    intervalId = setInterval(checkConnection, 30000);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [apiBaseUrl]);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <FaWifi />;
      case 'disconnected':
        return <FaWifiOff />;
      default:
        return <FaWifi className="spinner" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Connecting...';
    }
  };

  return (
    <div className={`connection-status connection-status--${status}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {lastChecked && (
        <small>
          Last checked: {lastChecked.toLocaleTimeString()}
        </small>
      )}
    </div>
  );
};

export default ConnectionStatus;
