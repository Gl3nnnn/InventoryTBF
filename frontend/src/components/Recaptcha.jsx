import React from 'react';

const Recaptcha = ({ onChange }) => {
  const handleChange = () => {
    // Mock CAPTCHA always returns a dummy token
    onChange('mock-captcha-token');
  };

  React.useEffect(() => {
    handleChange();
  }, []);

  return (
    <div className="p-2 bg-gray-200 text-center rounded text-gray-700 mb-4">
      CAPTCHA mock enabled for local development
    </div>
  );
};

export default Recaptcha;
