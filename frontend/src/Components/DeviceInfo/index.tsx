import React, { useState, useEffect } from 'react';
import './deviceInfo.css';

interface DeviceInfoProps {
  completedSteps: (boolean | null)[];
  activePage: number;
  setActivePage: (page: number) => void;
  messages: Array<{text: string, step: number}>;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ 
  completedSteps, 
  activePage, 
  setActivePage,
  messages 
}) => {
  // Aktif adımı bul (son false olan veya ilk null olan)
  useEffect(() => {
    const currentStep = completedSteps.findIndex((step, index) => {
      if (step === false) return true;
      if (step === null && completedSteps[index - 1] === true) return true;
      return false;
    });
    
    if (currentStep !== -1) {
      setActivePage(currentStep + 1);
    }
  }, [completedSteps]);

  const handleStepClick = (stepNumber: number) => {
    setActivePage(stepNumber);
  };

  return (
    <>
      <div className="device-info">
        <p>
          Lütfen bilgisayara USB kablosunun bağlı olduğundan emin olunuz...
        </p>
        <p>Ayarlar bölümünden USB seçeneğini kontrol ediniz.</p>
        <p>Lütfen bilgisayara Ethernet kablosunun bağlı olduğundan emin olunuz...</p>
      </div>
      <button className="test-button">Teste Başla</button>
      <div className="test-container">
        <div id='test-page-1' className={`test-page ${activePage === 1 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 1</div>
          {messages.filter(msg => msg.step === 1).map((msg, index) => (
            <div key={index} className="test-message">{msg.text}</div>
          ))}
        </div>
        <div id='test-page-2' className={`test-page ${activePage === 2 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 2</div>
          {messages.filter(msg => msg.step === 2).map((msg, index) => (
            <div key={index} className="test-message">{msg.text}</div>
          ))}
        </div>
        <div id='test-page-3' className={`test-page ${activePage === 3 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 3</div>
          {messages.filter(msg => msg.step === 3).map((msg, index) => (
            <div key={index} className="test-message">{msg.text}</div>
          ))}
        </div>
        <div id='test-page-4' className={`test-page ${activePage === 4 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 4</div>
        </div>
        <div id='test-page-5' className={`test-page ${activePage === 5 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 5</div>
        </div>
        <div id='test-page-6' className={`test-page ${activePage === 6 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 6</div>
        </div>
        <div id='test-page-7' className={`test-page ${activePage === 7 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 7</div>
        </div>
        <div id='test-page-8' className={`test-page ${activePage === 8 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 8</div>
        </div>
        <div id='test-page-9' className={`test-page ${activePage === 9 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 9</div>
        </div>
        <div id='test-page-10' className={`test-page ${activePage === 10 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 10</div>
        </div>
        <div id='test-page-11' className={`test-page ${activePage === 11 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 11</div>
        </div>
        <div id='test-page-12' className={`test-page ${activePage === 12 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 12</div>
        </div>
        <div id='test-page-13' className={`test-page ${activePage === 13 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 13</div>
        </div>
        <div id='test-page-14' className={`test-page ${activePage === 14 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 14</div>
        </div>
        <div id='test-page-15' className={`test-page ${activePage === 15 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 15</div>
        </div>
        <div id='test-page-16' className={`test-page ${activePage === 16 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 16</div>
        </div>
        <div id='test-page-17' className={`test-page ${activePage === 17 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 17</div>
        </div>
        <div id='test-page-18' className={`test-page ${activePage === 18 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 18</div>
        </div>
        <div id='test-page-19' className={`test-page ${activePage === 19 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 19</div>
        </div>
        <div id='test-page-20' className={`test-page ${activePage === 20 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 20</div>
        </div>
        
        <div className="test-steps">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`test-step 
                ${completedSteps[i] === true ? 'test-success' : ''} 
                ${completedSteps[i] === false ? 'test-error' : ''}
                ${completedSteps[i] === null ? 'test-waiting' : ''}`
              }
              onClick={() => handleStepClick(i + 1)}
              style={{ left: `${15 + (i * 28)}px` }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DeviceInfo; 