import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./home2.css";
import { toast } from "react-toastify";
import { useMessage, Item } from '../../Components/MessageContext';
import Settings from '../../Components/Settings';
import DeviceInfo from '../../Components/DeviceInfo';
import WebSocketComponent from '../../Components/WebSocketComponent';
import ProductInfoComponent from '../../Components/ProductInfo';
import KnowledgeDevice from '../../Components/KnowledgeDevice';

export interface ProductInfo {
    serial_number: string;
    product_code: string;
    charge_point_id: string;
    ethernet_mac: string;
    bluetooth_mac: string;
    four_g_imei: string;
    master_card_rfid: string;
    slave_1_card_rfid: string;
    slave_2_card_rfid: string;
    product_description: string;
    bluetooth_key: string;
    bluetooth_iv_key: string;
    bluetooth_password: string;
}

interface FilterState {
    [key: string]: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [activeInputIndex, setActiveInputIndex] = useState(0); // Aktif inputun indeksini tutar
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [isHighlightRed, setIsHighlightRed] = useState(true);
    const [activeSection, setActiveSection] = useState('settings');
    const [steps, setSteps] = useState<(boolean | null)[]>(new Array(23).fill(null));
    const [selectedSerial, setSelectedSerial] = useState('');
    const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
    const [testTimes, setTestTimes] = useState<string[]>([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [tableData, setTableData] = useState<{testNo: string, description: string, value: string}[]>([]);
    const [messages, setMessages] = useState<Array<{text: string, step: number, fontSize?: string}>>([]);
    const [activePage, setActivePage] = useState(1);
    const [productInfoList, setProductInfoList] = useState<ProductInfo[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        serial_number: '',
        product_code: '',
        charge_point_id: '',
        ethernet_mac: '',
        bluetooth_mac: '',
        four_g_imei: '',
        master_card_rfid: '',
        slave_1_card_rfid: '',
        slave_2_card_rfid: '',
        product_description: '',
        bluetooth_key: '',
        bluetooth_iv_key: '',
        bluetooth_password: ''
    });

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
        selectedUSB, setSelectedUSB,
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
                    toast.success("Ayarlar başarıyla kaydedildi!");
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

    function startTest() {
        if (verifyInputs()) {
            if (socket) {
                if (socket.readyState === socket.OPEN) {
                    socket.send(JSON.stringify({
                        "Command": "StartTest",
                        "Data": ""
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
        const selectedValue = event.target.value;
        setSelectedSerial(selectedValue);
        
        // Seçilen seri numarası için logları iste
        if (socket && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify({
                Command: "SelectedSeriNoLog",
                Data: selectedValue
            }));
        }
    };
    
    const handleButtonClick = (index: number) => {
        setActiveButton(index);
        if (socket && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify({
                Command: "SelectedSeriNoLog",
                Data: {
                    seriNo: selectedSerial,
                    testTime: testTimes[index]
                }
            }));
        }
    };

    useEffect(() => {
        console.log("selectedUSB değişti:", selectedUSB);
        if (selectedUSB) {
            setActiveSection('settings');
            setIsDisabled(false);
        }
    }, [selectedUSB]);

    const handleAddItem = (message: string, isSuccess: boolean | null, type: string | null = null, step?: number, fontSize?: string) => {
        if (step) {
            setMessages(prev => [...prev, {
                text: message, 
                step,
                fontSize
            }]);
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

    const handleFilterChange = (column: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            [column]: event.target.value
        }));
    };

    const filteredProductList = productInfoList.filter(product => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key].toLowerCase();
            const productValue = String(product[key as keyof ProductInfo]).toLowerCase();
            return productValue.includes(filterValue);
        });
    });

    return (
        <div className="full-screen">
            <WebSocketComponent 
                handleAddItem={handleAddItem} 
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                setProductInfoList={setProductInfoList}
                setActivePage={setActivePage}
                setSerialNumbers={setSerialNumbers}
                setTableData={setTableData}
                setTestTimes={setTestTimes}
                selectedTestTime={activeButton !== null ? testTimes[activeButton] : null}
            />
            
            <div className="navbar">
                <div className={`section ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => handleSectionClick('settings')}>Ayarlar</div>
                <div className={`section ${activeSection === 'newdevice' ? 'active' : ''}`} onClick={() => handleSectionClick('newdevice')}>Yeni Cihaz Ekle</div>
                <div className={`section ${activeSection === 'knowledgedevice' ? 'active' : ''}`} onClick={() => handleSectionClick('knowledgedevice')}>Cihaz Test Logları</div>
                <div className={`section ${activeSection === 'productinfo' ? 'active' : ''}`} onClick={() => handleSectionClick('productinfo')}>Cihaz Bilgileri</div>
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
                    completedSteps={steps} 
                    setCompletedSteps={setSteps}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    messages={messages}
                    setMessages={setMessages}
                    startTest={startTest}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                />
            </div>

            <div id="knowledgedevice" className={`container ${activeSection != 'knowledgedevice' ? 'hide' : ''}`}>
                <KnowledgeDevice
                    selectedSerial={selectedSerial}
                    handleSerialChange={handleSerialChange}
                    serialNumbers={serialNumbers}
                    activeButton={activeButton}
                    handleButtonClick={handleButtonClick}
                    tableData={tableData}
                    testTimes={testTimes}
                />
            </div>
            
            <div id="productinfo" className={`container ${activeSection !== 'productinfo' ? 'hide' : ''}`}>
                <ProductInfoComponent
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    filteredProductList={filteredProductList}
                />
            </div>
        </div>
       
    );
};

export default Home;
