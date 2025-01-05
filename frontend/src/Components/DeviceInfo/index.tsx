import React, { useState, useEffect } from 'react';
import './deviceInfo.css';
import { useMessage } from '../../Components/MessageContext';

interface DeviceInfoProps {
  completedSteps: (boolean | null)[];
  setCompletedSteps: (steps: (boolean | null)[]) => void;
  activePage: number;
  setActivePage: (page: number) => void;
  messages: Array<{
    text: string, 
    step: number,
    fontSize?: string
  }>;
  setMessages: (messages: Array<{text: string, step: number, fontSize?: string}>) => void;
  startTest: () => void;
  cancelTest: () => void;
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ 
  completedSteps, 
  setCompletedSteps,
  activePage, 
  setActivePage,
  messages,
  setMessages,
  startTest,
  cancelTest,
  isDisabled,
  setIsDisabled
}) => {
  const [isBlue, setIsBlue] = useState(true);
  const {
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    isStep5Complete,
    isStep6Complete,
    isStep7Complete,
    isStep8Complete,
    isStep9Complete,
    isStep10Complete,
    isStep11Complete,
    isStep12Complete,
    isStep13Complete,
    isStep14Complete,
    isStep15Complete,
    isStep16Complete,
    isStep17Complete,
    isStep18Complete,
    isStep19Complete,
    isStep20Complete,
    isStep21Complete,
    isStep22Complete,
    isStep23Complete,
    isStep24Complete,
  } = useMessage();

  // Renk değişimi için interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlue(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Her sayfa için son mesajı al
  const getLastMessage = (step: number) => {
    const pageMessages = messages.filter(msg => msg.step === step);
    return pageMessages[pageMessages.length - 1];
  };

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

  // Her sayfa için mesajı göster
  const renderPageMessage = (step: number) => {
    const lastMessage = getLastMessage(step);
    if (!lastMessage) return null;

    const isActiveAndLatest = activePage === step && step === Math.max(...messages.map(m => m.step));
    const isStepFailed = completedSteps[step - 1] === false;
    
    return (
      <div 
        className={`test-message ${
          isActiveAndLatest ? (
            isStepFailed ? 'red-text' : (isBlue ? 'blue-text' : 'red-text')
          ) : ''
        } ${isStepFailed ? 'red-text' : ''}`}
        style={{ fontSize: lastMessage.fontSize || '40px' }}
      >
        {lastMessage.text}
      </div>
    );
  };

  // Step durumlarını takip et
  useEffect(() => {
    const newCompletedSteps = [...completedSteps];
    if (isStep1Complete !== null) newCompletedSteps[0] = isStep1Complete;
    if (isStep2Complete !== null) newCompletedSteps[1] = isStep2Complete;
    if (isStep3Complete !== null) newCompletedSteps[2] = isStep3Complete;
    if (isStep4Complete !== null) newCompletedSteps[3] = isStep4Complete;
    if (isStep5Complete !== null) newCompletedSteps[4] = isStep5Complete;
    if (isStep6Complete !== null) newCompletedSteps[5] = isStep6Complete;
    if (isStep7Complete !== null) newCompletedSteps[6] = isStep7Complete;
    if (isStep8Complete !== null) newCompletedSteps[7] = isStep8Complete;
    if (isStep9Complete !== null) newCompletedSteps[8] = isStep9Complete;
    if (isStep10Complete !== null) newCompletedSteps[9] = isStep10Complete;
    if (isStep11Complete !== null) newCompletedSteps[10] = isStep11Complete;
    if (isStep12Complete !== null) newCompletedSteps[11] = isStep12Complete;
    if (isStep13Complete !== null) newCompletedSteps[12] = isStep13Complete;
    if (isStep14Complete !== null) newCompletedSteps[13] = isStep14Complete;
    if (isStep15Complete !== null) newCompletedSteps[14] = isStep15Complete;
    if (isStep16Complete !== null) newCompletedSteps[15] = isStep16Complete;
    if (isStep17Complete !== null) newCompletedSteps[16] = isStep17Complete;
    if (isStep18Complete !== null) newCompletedSteps[17] = isStep18Complete;
    if (isStep19Complete !== null) newCompletedSteps[18] = isStep19Complete;
    if (isStep20Complete !== null) newCompletedSteps[19] = isStep20Complete;
    if (isStep21Complete !== null) newCompletedSteps[20] = isStep21Complete;
    if (isStep22Complete !== null) newCompletedSteps[21] = isStep22Complete;
    if (isStep23Complete !== null) newCompletedSteps[22] = isStep23Complete;
    if (isStep24Complete !== null) newCompletedSteps[23] = isStep24Complete;
    
    setCompletedSteps(newCompletedSteps);
  }, [
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    isStep5Complete,
    isStep6Complete,
    isStep7Complete,
    isStep8Complete,
    isStep9Complete,
    isStep10Complete,
    isStep11Complete,
    isStep12Complete,
    isStep13Complete,
    isStep14Complete,
    isStep15Complete,
    isStep16Complete,
    isStep17Complete,
    isStep18Complete,
    isStep19Complete,
    isStep20Complete,
    isStep21Complete,
    isStep22Complete,
    isStep23Complete,
    isStep24Complete
  ]);

  const handleCancelTest = () => {
    // Reset all states
    setCompletedSteps(new Array(24).fill(null));
    setActivePage(1);
    setMessages([]);
    cancelTest();
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
      <button 
        className={`test-button ${isDisabled ? 'cancel-test' : ''}`} 
        onClick={isDisabled ? handleCancelTest : startTest}
      >
        {isDisabled ? 'Testi Bitir' : 'Teste Başla'}
      </button>
      <div className="test-container">
        <div id='test-page-1' className={`test-page ${activePage === 1 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 1</div>
          {renderPageMessage(1)}
        </div>
        <div id='test-page-2' className={`test-page ${activePage === 2 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 2</div>
          {renderPageMessage(2)}
        </div>
        <div id='test-page-3' className={`test-page ${activePage === 3 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 3</div>
          {renderPageMessage(3)}
        </div>
        <div id='test-page-4' className={`test-page ${activePage === 4 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 4</div>
          {renderPageMessage(4)}
        </div>
        <div id='test-page-5' className={`test-page ${activePage === 5 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 5</div>
          {renderPageMessage(5)}
        </div>
        <div id='test-page-6' className={`test-page ${activePage === 6 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 6</div>
          {renderPageMessage(6)}
        </div>
        <div id='test-page-7' className={`test-page ${activePage === 7 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 7</div>
          {renderPageMessage(7)}
        </div>
        <div id='test-page-8' className={`test-page ${activePage === 8 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 8</div>
          {renderPageMessage(8)}
        </div>
        <div id='test-page-9' className={`test-page ${activePage === 9 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 9</div>
          {renderPageMessage(9)}
        </div>
        <div id='test-page-10' className={`test-page ${activePage === 10 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 10</div>
          {renderPageMessage(10)}
        </div>
        <div id='test-page-11' className={`test-page ${activePage === 11 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 11</div>
          {renderPageMessage(11)}
        </div>
        <div id='test-page-12' className={`test-page ${activePage === 12 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 12</div>
          {renderPageMessage(12)}
        </div>
        <div id='test-page-13' className={`test-page ${activePage === 13 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 13</div>
          {renderPageMessage(13)}
        </div>
        <div id='test-page-14' className={`test-page ${activePage === 14 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 14</div>
          {renderPageMessage(14)}
        </div>
        <div id='test-page-15' className={`test-page ${activePage === 15 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 15</div>
          {renderPageMessage(15)}
        </div>
        <div id='test-page-16' className={`test-page ${activePage === 16 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 16</div>
          {renderPageMessage(16)}
        </div>
        <div id='test-page-17' className={`test-page ${activePage === 17 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 17</div>
          {renderPageMessage(17)}
        </div>
        <div id='test-page-18' className={`test-page ${activePage === 18 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 18</div>
          {renderPageMessage(18)}
        </div>
        <div id='test-page-19' className={`test-page ${activePage === 19 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 19</div>
          {renderPageMessage(19)}
        </div>
        <div id='test-page-20' className={`test-page ${activePage === 20 ? 'active-test' : 'hidden'}`}>
          <div className='test-page-title'>TEST ADIM 20</div>
          {renderPageMessage(20)}
        </div>
        
        <div className="test-steps">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className={`test-step 
                ${completedSteps[i] === true ? 'test-success' : ''} 
                ${completedSteps[i] === false ? 'test-error' : ''}
                ${completedSteps[i] === null ? 'test-waiting' : ''}
                ${messages.some(m => m.step === i + 1) && i + 1 === Math.max(...messages.map(m => m.step)) ? 
                  (completedSteps[i] === false ? 'test-error' : 'test-active') : ''}`
              }
              onClick={() => handleStepClick(i + 1)}
              style={{ left: `${0 + (i * 24)}px` }}
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