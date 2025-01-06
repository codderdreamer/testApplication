import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./home2.css";
import { toast } from "react-toastify";
import { useMessage, Item } from '../../Components/MessageContext';
import Settings from '../../Components/Settings';
import DeviceInfo from '../../Components/DeviceInfo';
import WebSocketComponent from '../../Components/WebSocketComponent';

interface ProductInfo {
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
    location: string;
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
    const [serialNumbers, setSerialNumbers] = useState([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [tableData, setTableData] = useState<{description: string, value: string}[]>([]);
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
        bluetooth_password: '',
        location: ''
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
        setSelectedSerial(event.target.value);
    };
    
    const handleButtonClick = (index: number) => {
        setActiveButton(index);
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
            />
            <div className="navbar">
                <div className={`section ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => handleSectionClick('settings')}>Ayarlar</div>
                <div className={`section ${activeSection === 'newdevice' ? 'active' : ''}`} onClick={() => handleSectionClick('newdevice')}>Yeni Cihaz Ekle</div>
                <div className={`section ${activeSection === 'updatedevice' ? 'active' : ''}`} onClick={() => handleSectionClick('updatedevice')}>Cihaz Güncelle</div>
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
                            className={`test-step ${steps[i] ? 'test-success' : ''}`}
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
            <div id="productinfo" className={`container ${activeSection !== 'productinfo' ? 'hide' : ''}`}>
                <div className="product-info-container">
                    <table className="product-info-table">
                        <thead>
                            <tr>
                                <th>
                                    <div>#</div>
                                </th>
                                <th>
                                    <div>Seri No</div>
                                    <input
                                        type="text"
                                        value={filters.serial_number}
                                        onChange={handleFilterChange('serial_number')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Ürün Kodu</div>
                                    <input
                                        type="text"
                                        value={filters.product_code}
                                        onChange={handleFilterChange('product_code')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>CPID</div>
                                    <input
                                        type="text"
                                        value={filters.charge_point_id}
                                        onChange={handleFilterChange('charge_point_id')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Ethernet MAC</div>
                                    <input
                                        type="text"
                                        value={filters.ethernet_mac}
                                        onChange={handleFilterChange('ethernet_mac')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Bluetooth MAC</div>
                                    <input
                                        type="text"
                                        value={filters.bluetooth_mac}
                                        onChange={handleFilterChange('bluetooth_mac')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>4G IMEI</div>
                                    <input
                                        type="text"
                                        value={filters.four_g_imei}
                                        onChange={handleFilterChange('four_g_imei')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Master Kart RFID</div>
                                    <input
                                        type="text"
                                        value={filters.master_card_rfid}
                                        onChange={handleFilterChange('master_card_rfid')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Slave 1 Kart RFID</div>
                                    <input
                                        type="text"
                                        value={filters.slave_1_card_rfid}
                                        onChange={handleFilterChange('slave_1_card_rfid')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Slave 2 Kart RFID</div>
                                    <input
                                        type="text"
                                        value={filters.slave_2_card_rfid}
                                        onChange={handleFilterChange('slave_2_card_rfid')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Ürün Açıklaması</div>
                                    <input
                                        type="text"
                                        value={filters.product_description}
                                        onChange={handleFilterChange('product_description')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Bluetooth Key</div>
                                    <input
                                        type="text"
                                        value={filters.bluetooth_key}
                                        onChange={handleFilterChange('bluetooth_key')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Bluetooth IV Key</div>
                                    <input
                                        type="text"
                                        value={filters.bluetooth_iv_key}
                                        onChange={handleFilterChange('bluetooth_iv_key')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Bluetooth Şifre</div>
                                    <input
                                        type="text"
                                        value={filters.bluetooth_password}
                                        onChange={handleFilterChange('bluetooth_password')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                                <th>
                                    <div>Konum</div>
                                    <input
                                        type="text"
                                        value={filters.location}
                                        onChange={handleFilterChange('location')}
                                        placeholder="Filtrele..."
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="scrollable-body">
                            {filteredProductList.map((info, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{info.serial_number}</td>
                                    <td>{info.product_code}</td>
                                    <td>{info.charge_point_id}</td>
                                    <td>{info.ethernet_mac}</td>
                                    <td>{info.bluetooth_mac}</td>
                                    <td>{info.four_g_imei}</td>
                                    <td>{info.master_card_rfid}</td>
                                    <td>{info.slave_1_card_rfid}</td>
                                    <td>{info.slave_2_card_rfid}</td>
                                    <td>{info.product_description}</td>
                                    <td>{info.bluetooth_key}</td>
                                    <td>{info.bluetooth_iv_key}</td>
                                    <td>{info.bluetooth_password}</td>
                                    <td>{info.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
       
    );
};

export default Home;
