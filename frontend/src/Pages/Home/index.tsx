import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./home.css";
import { toast } from "react-toastify";
import { useMessage } from '../../Components/MessageContext';

const Home = () => {
    const navigate = useNavigate();
    const [activeInputIndex, setActiveInputIndex] = useState(0); // Aktif inputun indeksini tutar
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedUSB, setSelectedUSB] = useState('');
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [isHighlightRed, setIsHighlightRed] = useState(true);

    const {
        socket,
        USBList,
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


    // useEffect(() => {
    //     console.log("hey")
    // }, [wifiSSID]);

    // const handleAddDiv = (text:string) => {
    //     const newDiv = (
    //       <div className="text3" key={divs.length}>
    //         {text} <Tick />
    //       </div>
    //     );
    //     setDivs([...divs, newDiv]); // Add the new div to the state
    //   };

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

    function testStart() {
        if (verifyInputs()) {
            if (socket) {
                if (socket.readyState === socket.OPEN) {
                    socket.send(JSON.stringify({
                        "Command": "StartTest",
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
    

    return (
        <div className='fullscreen-div'>
            <div className="screen-1">
                <div className='header'>Hera Test Uygulaması</div>
                <div className='text1'>Lütfen bigisyara USB ve Ethernet kablosunu takınız...</div>
                <div>
                    <span className='text2'>Bağlı USB Kablosu:</span>
                    <select className="text2" value={selectedUSB} onChange={handleUSBChange}>
                        <option value="" disabled>
                            USB Seçiniz
                        </option>
                        {USBList.map((usb, index) => (
                            <option key={index} value={usb}>
                                {usb}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <span className='text2'>Bağlanacak cihazın Ethernet IP'si:</span>
                    <span className='text2'>172.16.0.104</span>
                </div>
                <div className='text1'>Cihazın bağlanacağı wifi adresi ve şifresini giriniz...</div>
                <div>
                    <span className='text2'>Wifi SSID:</span>
                    <span className='text2'><input className="input" type="text" value={wifiSSID} onChange={handlewifiSSIDChange} /></span>
                </div>
                <div>
                    <span className='text2'>Wifi Password:</span>
                    <span className='text2'><input className="input" type="text" value={wifiPassword} onChange={handlewifiPasswordChange} /></span>
                </div>
                <div>
                    <span className='text2'>4G APN Adresi:</span>
                    <span className='text2'><input className="input" type="text" value={fourG_apn} onChange={handlefourG_apnChange} /></span>
                </div>
                <div>
                    <span className='text2'>4G User:</span>
                    <span className='text2'><input className="input" type="text" value={fourG_user} onChange={handlefourG_userChange} /></span>
                </div>
                <div>
                    <span className='text2'>4G Password:</span>
                    <span className='text2'><input className="input" type="text" value={fourG_password} onChange={handlefourG_passwordChange} /></span>
                </div>
                <div>
                    <span className='text2'>4G Pin:</span>
                    <span className='text2'><input className="input" type="text" value={fourG_pin} onChange={handlefourG_pinChange} /></span>
                </div>

                <button className='start' onClick={testStart} disabled={isDisabled}>Teste Başla</button>
                <button className='fakestart' onClick={fakeTestStart} disabled={isDisabled}>Fake Teste Başla</button>
                <button className='cancelTest' onClick={cancelTest} >Testi İptal Et</button>

            </div>

            <div className="screen-2" ref={containerRef}>
                
            {items.map((item, index) => {
        if (item.type === "header") {
          return (
            <div
              key={index}
              className="textlog"
              style={{
                margin: "10px 0",
                fontWeight: 900,
                color: "#6dff28",
                background: "#0b091e",
              }}
            >
              {item.message}
            </div>
          );
        } else {
          return (
            <div
              className="textlog"
              key={index}
              style={{
                margin: "10px 0",
                color: item.isSuccess === false ? "red" : "inherit",
                background:
                  index === highlightIndex
                    ? isHighlightRed
                      ? "blue"
                      : "green"
                    : "inherit",
              }}
            >
              {item.message}
              {item.isSuccess === true && (
                <img className="tick" src="/assets/img/tik.png" alt="" />
              )}
            </div>
          );
        }
      })}

            </div>

        </div>
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