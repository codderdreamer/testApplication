import React, { useState, useEffect } from 'react';
import './deviceInfo.css';

interface DeviceInfoProps {
  completedSteps: (boolean | null)[];
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ completedSteps }) => {
  const [activePage, setActivePage] = useState<number>(1);

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
        <div id='test-page-1' className={`test-page ${activePage === 1 ? 'active-test' : 'hidden'}`}>SMART FONKSIYON ve BAĞLANTI TESTLERİ</div>
        <div id='test-page-2' className={`test-page ${activePage === 2 ? 'active-test' : 'hidden'}`}>ŞARJ TESTİ</div>
        <div id='test-page-3' className={`test-page ${activePage === 3 ? 'active-test' : 'hidden'}`}>Sayfa 3</div>
        <div id='test-page-4' className={`test-page ${activePage === 4 ? 'active-test' : 'hidden'}`}>Sayfa 4</div>
        <div id='test-page-5' className={`test-page ${activePage === 5 ? 'active-test' : 'hidden'}`}>Sayfa 5</div>
        <div id='test-page-6' className={`test-page ${activePage === 6 ? 'active-test' : 'hidden'}`}>Sayfa 6</div>
        <div id='test-page-7' className={`test-page ${activePage === 7 ? 'active-test' : 'hidden'}`}>Sayfa 7</div>
        <div id='test-page-8' className={`test-page ${activePage === 8 ? 'active-test' : 'hidden'}`}>Sayfa 8</div>
        <div id='test-page-9' className={`test-page ${activePage === 9 ? 'active-test' : 'hidden'}`}>Sayfa 9</div>
        <div id='test-page-10' className={`test-page ${activePage === 10 ? 'active-test' : 'hidden'}`}>Sayfa 10</div>    
        <div id='test-page-11' className={`test-page ${activePage === 11 ? 'active-test' : 'hidden'}`}>Sayfa 11</div>
        <div id='test-page-12' className={`test-page ${activePage === 12 ? 'active-test' : 'hidden'}`}>Sayfa 12</div>
        <div id='test-page-13' className={`test-page ${activePage === 13 ? 'active-test' : 'hidden'}`}>Sayfa 13</div>
        <div id='test-page-14' className={`test-page ${activePage === 14 ? 'active-test' : 'hidden'}`}>Sayfa 14</div>
        <div id='test-page-15' className={`test-page ${activePage === 15 ? 'active-test' : 'hidden'}`}>Sayfa 15</div>
        <div id='test-page-16' className={`test-page ${activePage === 16 ? 'active-test' : 'hidden'}`}>Sayfa 16</div>
        <div id='test-page-17' className={`test-page ${activePage === 17 ? 'active-test' : 'hidden'}`}>Sayfa 17</div>
        <div id='test-page-18' className={`test-page ${activePage === 18 ? 'active-test' : 'hidden'}`}>Sayfa 18</div>
        <div id='test-page-19' className={`test-page ${activePage === 19 ? 'active-test' : 'hidden'}`}>Sayfa 19</div>
        <div id='test-page-20' className={`test-page ${activePage === 20 ? 'active-test' : 'hidden'}`}>Sayfa 20</div>
        
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