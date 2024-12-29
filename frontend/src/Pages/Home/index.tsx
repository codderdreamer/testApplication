import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
// import "./home.css";
import "./home2.css";
import { toast } from "react-toastify";
import { useMessage, Item } from '../../Components/MessageContext';
import Settings from '../../Components/Settings';
import DeviceInfo from '../../Components/DeviceInfo';
import WebSocketComponent from '../../Components/WebSocketComponent';

const Home = () => {
    const navigate = useNavigate();
    const [activeInputIndex, setActiveInputIndex] = useState(0); // Aktif inputun indeksini tutar
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedUSB, setSelectedUSB] = useState('');
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [isHighlightRed, setIsHighlightRed] = useState(true);
    const [activeSection, setActiveSection] = useState('settings');
    const [isStep1Complete, setIsStep1Complete] = useState(false);
    const [isStep2Complete, setIsStep2Complete] = useState(false);
    const [isStep3Complete, setIsStep3Complete] = useState(false);
    const [isStep4Complete, setIsStep4Complete] = useState(false);
    const [isStep5Complete, setIsStep5Complete] = useState(false);
    const [isStep6Complete, setIsStep6Complete] = useState(false);
    const [isStep7Complete, setIsStep7Complete] = useState(false);
    const [isStep8Complete, setIsStep8Complete] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<(boolean | null)[]>(new Array(20).fill(null));
    const [selectedSerial, setSelectedSerial] = useState('');
    const [serialNumbers, setSerialNumbers] = useState([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [tableData, setTableData] = useState<{description: string, value: string}[]>([]);
    const [messages, setMessages] = useState<Array<{text: string, step: number}>>([]);
    const [activePage, setActivePage] = useState(1);

    const {
        socket,
        USBList,
        deviceConnected,
        setUSBList,
        wifiSSID,
        setwifiSSID,
        wifiPassword,
        setwifiPassword,
        fourG_apn,
        setfourG_apn,
        fourG_user,
        setfourG_user,
        fourG_password,
        setfourG_password,
        fourG_pin,
        setfourG_pin,
        items,
        setItems,
        containerRef,timeoutId, setTimeoutId,
        LOADBANK_I1, setLOADBANK_I1,
        LOADBANK_I2, setLOADBANK_I2,
        LOADBANK_I3, setLOADBANK_I3,
        LOADBANK_V1, setLOADBANK_V1,
        LOADBANK_V2, setLOADBANK_V2,
        LOADBANK_V3, setLOADBANK_V3,
        LOADBANK_P1, setLOADBANK_P1,
        LOADBANK_P2, setLOADBANK_P2,
        LOADBANK_P3, setLOADBANK_P3
    } = useMessage();

    useEffect(() => {
        if (items.length > 0) {
          setHighlightIndex(items.length - 1);
    
          const interval = setInterval(() => {
            setIsHighlightRed((prev) => !prev);
          }, 1000);
    
          return () => clearInterval(interval); // Cleanup
        }
      }, [items]);

    function verifyInputs() {
        if (selectedUSB == "") {
            toast.error("Lütfen USB seçiniz!")
            return false
        }
        else if (wifiSSID == "") {
            toast.error("Lütfen cihazın bağlanacağı wifi adresini giriniz!")
            return false
        }
        else if (wifiPassword == "") {
            toast.error("Lütfen cihazın bağlanacağı wifi şifresini giriniz!")
            return false
        }
        return true
    }

    function save() {
        if (verifyInputs()) {
            if (socket) {
                if (socket.readyState === socket.OPEN) {
                    socket.send(JSON.stringify({
                        "Command": "Save",
                        "Data": {
                            "selectedUSB": selectedUSB,
                            "wifiSSID": wifiSSID,
                            "wifiPassword": wifiPassword,
                            "fourG_apn": fourG_apn,
                            "fourG_user": fourG_user,
                            "fourG_password": fourG_password,
                            "fourG_pin": fourG_pin,
                            "sap": true
                        }
                    }));
                    setIsDisabled(true);
                }
                else {
                    toast.error("Server'a bağlanılamıyor!");
                }
            }
            else {
                toast.error("Server'a bağlanılamıyor!");
            }

        }

    }

    function fakeTestStart() {
        if (verifyInputs()) {
            if (socket) {
                if (socket.readyState === socket.OPEN) {
                    socket.send(JSON.stringify({
                        "Command": "StartTest",
                        "Data": {
                            "selectedUSB": selectedUSB,
                            "wifiSSID": wifiSSID,
                            "wifiPassword": wifiPassword,
                            "sap": false
                        }
                    }));
                    setIsDisabled(true);
                }
                else {
                    toast.error("Server'a bağlanılamıyor!");
                }
            }
            else {
                toast.error("Server'a bağlanılamıyor!");
            }
        }
    }

    function cancelTest() {
        if (socket) {
            if (socket.readyState === socket.OPEN) {
                socket.send(JSON.stringify({
                    "Command": "CancelTest",
                    "Data": {}
                }));
                setIsDisabled(false);
                setItems([])
                if (timeoutId) clearTimeout(timeoutId);
            }
            else {
                toast.error("Server'a bağlanılamıyor!");
            }
        }
        else {
            toast.error("Server'a bağlanılamıyor!");
        }
    }

    const handleUSBChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUSB(event.target.value);
    };


    const handlewifiSSIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setwifiSSID(event.target.value);
    };

    const handlewifiPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setwifiPassword(event.target.value);
    };

    const handlefourG_apnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfourG_apn(event.target.value);
    }

    const handlefourG_userChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfourG_user(event.target.value);
    }

    const handlefourG_passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfourG_password(event.target.value);
    }

    const handlefourG_pinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfourG_pin(event.target.value);
    }

    const Tick = () => {
        return <img className="tick" src="/assets/img/tik.png" alt="" />
    };

    const handleSectionClick = (sectionName:string) => {
        setActiveSection(sectionName);
    };

    const handleSerialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSerial(event.target.value);
    };
    
    const handleButtonClick = (index: number) => {
        setActiveButton(index);
        // Her butona ait farklı veriler
        switch(index) {
            case 0:
                setTableData([
                    { description: "Test 1 verisi", value: "42" },
                    { description: "Test 1 sonucu", value: "Başarılı" }
                ]);
                break;
            case 1:
                setTableData([
                    { description: "Test 2 verisi", value: "123" },
                    { description: "Test 2 sonucu", value: "Devam ediyor" }
                ]);
                break;
            // Diğer butonlar için case'ler...
        }
    };

    useEffect(() => {
        console.log("selectedUSB değişti:", selectedUSB);
        if (selectedUSB) {
            // Settings'te USB seçildiğinde
            setActiveSection('settings');
            
            // USB seçimi yapıldığında form alanlarını etkinleştir
            setIsDisabled(false);
        }
    }, [selectedUSB]);

    const handleAddItem = (message: string, isSuccess: boolean | null, type: string | null = null, step?: number) => {
        console.log(message, isSuccess, type, step);
        if (step) {
            setMessages(prev => [...prev, {text: message, step}]);
            setActivePage(step);
        }

        setItems((prevItems: Item[]) => [
            ...prevItems,
            { message, isSuccess, type },
        ]);

        if (containerRef.current) {
            setTimeout(() => {
                containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
            }, 0);
        }
    };

    return (
        <div className="full-screen">
            <WebSocketComponent handleAddItem={handleAddItem} />
            <div className="navbar">
                <div className={`section ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => handleSectionClick('settings')}>Ayarlar</div>
                <div className={`section ${activeSection === 'newdevice' ? 'active' : ''}`} onClick={() => handleSectionClick('newdevice')}>Yeni Cihaz Ekle</div>
                <div className={`section ${activeSection === 'updatedevice' ? 'active' : ''}`} onClick={() => handleSectionClick('updatedevice')}>Cihaz Güncelle</div>
                <div className={`section ${activeSection === 'knowledgedevice' ? 'active' : ''}`} onClick={() => handleSectionClick('knowledgedevice')}>Cihaz Bilgileri Sorgulama</div>
            </div>
            <div id="settings" className={`container ${activeSection != 'settings' ? 'hide' : ''}`}>
                <Settings 
                    wifiSSID={wifiSSID}
                    setWifiSSID={setwifiSSID}
                    wifiPassword={wifiPassword}
                    setWifiPassword={setwifiPassword}
                    fourG_apn={fourG_apn}
                    setFourG_apn={setfourG_apn}
                    fourG_user={fourG_user}
                    setFourG_user={setfourG_user}
                    fourG_password={fourG_password}
                    setFourG_password={setfourG_password}
                    fourG_pin={fourG_pin}
                    setFourG_pin={setfourG_pin}
                    handleSave={save}
                    selectedUSB={selectedUSB}
                    setSelectedUSB={setSelectedUSB}
                    USBList={USBList}
                    handleUSBChange={handleUSBChange}
                />
            </div>
            <div id="newdevice" className={`container ${activeSection != 'newdevice' ? 'hide' : ''}`}>
                <DeviceInfo 
                    completedSteps={completedSteps} 
                    activePage={activePage}
                    setActivePage={setActivePage}
                    messages={messages}
                />
            </div>
            <div id="updatedevice" className={`container ${activeSection != 'updatedevice' ? 'hide' : ''}`}>
            <div className="device-info">
                    <p>
                        Lütfen bilgisayara USB kablosunun bağlı olduğundan emin olunuz...
                        {/* <div className={`connection-status ${deviceConnected ? 'connected' : 'disconnected'}`}>
                            {deviceConnected ? 'Bağlı' : 'Bağlı Değil'}
                        </div> */}
                    </p>
                    <p>Ayarlar bölümünden USB seçeneğini kontrol ediniz.</p>
                    <p>Lütfen bilgisayara Ethernet kablosunun bağlı olduğundan emin olunuz...</p>
                </div>
                <button className="test-button">Teste Başla</button>
                <div className="test-container">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className={`test-step ${completedSteps[i] ? 'test-success' : ''}`}
                            style={{ left: `${15 + (i * 28)}px` }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>
            <div id="knowledgedevice" className={`container ${activeSection != 'knowledgedevice' ? 'hide' : ''}`}>
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
                        {["14:30", "15:45", "16:20", "17:10", "18:00"].map((time, index) => (
                            <button 
                                key={index}
                                className={`knowledge-button ${activeButton === index ? 'active' : ''}`}
                                onClick={() => handleButtonClick(index)}
                            >
                                <span className="button-time">12.03.2024 {time}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="table-container">
                        <table className="knowledge-table">
                            <thead>
                                <tr>
                                    <th style={{width: '80%'}}>Açıklama</th>
                                    <th style={{width: '20%'}}>Değer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.description}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        // <div className='fullscreen-div'>
        //     <div className="screen-1">
        //         <div className='header'>Hera Test Uygulaması</div>
        //         <div className='text1'>Lütfen bigisyara USB ve Ethernet kablosunu takınız...</div>
        //         <div>
        //             <span className='text2'>Bağlı USB Kablosu:</span>
        //             <select className="text2" value={selectedUSB} onChange={handleUSBChange}>
        //                 <option value="" disabled>
        //                     USB Seçiniz
        //                 </option>
        //                 {USBList.map((usb, index) => (
        //                     <option key={index} value={usb}>
        //                         {usb}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>
        //         <div>
        //             <span className='text2'>Bağlanacak cihazın Ethernet IP'si:</span>
        //             <span className='text2'>172.16.0.104</span>
        //         </div>
        //         <div className='text1'>Cihazın bağlanacağı wifi adresi ve şifresini giriniz...</div>
        //         <div>
        //             <span className='text2'>Wifi SSID:</span>
        //             <span className='text2'><input className="input" type="text" value={wifiSSID} onChange={handlewifiSSIDChange} /></span>
        //         </div>
        //         <div>
        //             <span className='text2'>Wifi Password:</span>
        //             <span className='text2'><input className="input" type="text" value={wifiPassword} onChange={handlewifiPasswordChange} /></span>
        //         </div>
        //         <div>
        //             <span className='text2'>4G APN Adresi:</span>
        //             <span className='text2'><input className="input" type="text" value={fourG_apn} onChange={handlefourG_apnChange} /></span>
        //         </div>
        //         <div>
        //             <span className='text2'>4G User:</span>
        //             <span className='text2'><input className="input" type="text" value={fourG_user} onChange={handlefourG_userChange} /></span>
        //         </div>
        //         <div>
        //             <span className='text2'>4G Password:</span>
        //             <span className='text2'><input className="input" type="text" value={fourG_password} onChange={handlefourG_passwordChange} /></span>
        //         </div>
        //         <div>
        //             <span className='text2'>4G Pin:</span>
        //             <span className='text2'><input className="input" type="text" value={fourG_pin} onChange={handlefourG_pinChange} /></span>
        //         </div>

        //         <button className='start' onClick={save} disabled={isDisabled}>Teste Başla</button>
        //         <button className='fakestart' onClick={fakeTestStart} disabled={isDisabled}>Fake Teste Başla</button>
        //         <button className='cancelTest' onClick={cancelTest} >Testi İptal Et</button>

        //     </div>

        //     <div className="screen-2" ref={containerRef}>
        //         {items.map((item, index) => {
        //             if (item.type === "header") {
        //             return (
        //                 <div
        //                 key={index}
        //                 className="textlog"
        //                 style={{
        //                     margin: "10px 0",
        //                     fontWeight: 900,
        //                     color: "#6dff28",
        //                     background: "#0b091e",
        //                 }}
        //                 >
        //                 {item.message}
        //                 </div>
        //             );
        //             } else {
        //             return (
        //                 <div
        //                 className="textlog"
        //                 key={index}
        //                 style={{
        //                     margin: "10px 0",
        //                     color: item.isSuccess === false ? "red" : "inherit",
        //                     background:
        //                     index === highlightIndex
        //                         ? isHighlightRed
        //                         ? "blue"
        //                         : "green"
        //                         : "inherit",
        //                 }}
        //                 >
        //                 {item.message}
        //                 {item.isSuccess === true && (
        //                     <img className="tick" src="/assets/img/tik.png" alt="" />
        //                 )}
        //                 </div>
        //             );
        //             }
        //         })}
        //     </div>
            
        //     <div className="screen-3">
        //         <span className="loads">LOADBANK_I1</span>
        //         <span className="loads">: {LOADBANK_I1}</span>
        //         <span className="loads">LOADBANK_I2</span>
        //         <span className="loads">: {LOADBANK_I2}</span>
        //         <span className="loads">LOADBANK_I3</span>
        //         <span className="loads">: {LOADBANK_I3}</span>
        //         <span className="loads">LOADBANK_V1</span>
        //         <span className="loads">: {LOADBANK_V1}</span>
        //         <span className="loads">LOADBANK_V2</span>
        //         <span className="loads">: {LOADBANK_V2}</span>
        //         <span className="loads">LOADBANK_V3</span>
        //         <span className="loads">: {LOADBANK_V3}</span>
        //         <span className="loads">LOADBANK_P1</span>
        //         <span className="loads">: {LOADBANK_P1}</span>
        //         <span className="loads">LOADBANK_P2</span>
        //         <span className="loads">: {LOADBANK_P2}</span>
        //         <span className="loads">LOADBANK_P3</span>
        //         <span className="loads">: {LOADBANK_P3}</span>

        //     </div>
        // </div>
    );
};

export default Home;


// {items.map((item, index) => (
                    
//     <div
//         className="textlog"
//         key={index}
//         style={{
//             margin: "10px 0",
//             color: item.isSuccess === false ? "red" : "inherit",
//         }}
//     >
//         {item.message}
//         {item.isSuccess === true && (
//             <img className="tick" src="/assets/img/tik.png" alt="" />
//         )}
//     </div>


// ))}