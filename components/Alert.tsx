import React from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded-md">
      <p>{message}</p>
      <button 
        className="bg-white text-black rounded px-4 py-2 mt-2"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default Alert;
