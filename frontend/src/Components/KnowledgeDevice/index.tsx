import React from 'react';
import './knowledgeDevice.css';

interface KnowledgeDeviceProps {
    selectedSerial: string;
    handleSerialChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    serialNumbers: string[];
    activeButton: number | null;
    handleButtonClick: (index: number) => void;
    tableData: Array<{testNo: string, description: string, value: string}>;
    testTimes: string[];
}

const KnowledgeDevice: React.FC<KnowledgeDeviceProps> = ({
    selectedSerial,
    handleSerialChange,
    serialNumbers,
    activeButton,
    handleButtonClick,
    tableData,
    testTimes
}) => {
    return (
        <div>
            <div className="serial-select-container">
                <span>Cihaz Seri No:</span>
                <select value={selectedSerial} onChange={handleSerialChange}>
                    <option value="" disabled>Seri No Seçiniz</option>
                    {serialNumbers.map((serial, index) => (
                        <option key={index} value={serial}>{serial}</option>
                    ))}
                </select>
            </div>
            
            <div className="knowledge-content">
                <div className="button-panel">
                    {testTimes.map((time, index) => (
                        <button 
                            key={index}
                            className={`knowledge-button ${activeButton === index ? 'active' : ''}`}
                            onClick={() => handleButtonClick(index)}
                        >
                            <span className="button-time">{time}</span>
                        </button>
                    ))}
                </div>
                
                <div className="table-container">
                    <table className="knowledge-table">
                        <thead>
                            <tr>
                                <th style={{width: '10%'}}>Test No</th>
                                <th style={{width: '80%'}}>Açıklama</th>
                                <th style={{width: '10%'}}>Test Sonucu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.testNo}</td>
                                    <td>{row.description}</td>
                                    <td>{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeDevice; 