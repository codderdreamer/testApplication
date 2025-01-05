import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useNavigate } from "react-router-dom";
import LoadingProduct from "../../assets/icons/loadingProduct.svg";
import { useMessage } from '../../Components/MessageContext';
import { toast } from "react-toastify";

interface Item {
  message: string;
  isSuccess: boolean | null;
  type: string | null;
}

type BarcodeType = "seriNo" | "chargePointId";

interface WebSocketComponentProps {
    handleAddItem: (message: string, isSuccess: boolean | null, type?: string | null, step?: number, fontSize?: string) => void;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ handleAddItem }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const navigate = useNavigate();
  const [waitingForBarcode, setWaitingForBarcode] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [mcu_error, setmcu_error] = useState("");
  // const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debounceId, setDebounceId] = useState<NodeJS.Timeout | null>(null);
  const [expectedBarcodeType, setExpectedBarcodeType] = useState<BarcodeType | null>(null);

  const {
    socket,
    setSocket,
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
    selectedUSB, setSelectedUSB,
    items,
    setItems, timeoutId, setTimeoutId,
    containerRef,
    LOADBANK_I1, setLOADBANK_I1,
    LOADBANK_I2, setLOADBANK_I2,
    LOADBANK_I3, setLOADBANK_I3,
    LOADBANK_V1, setLOADBANK_V1,
    LOADBANK_V2, setLOADBANK_V2,
    LOADBANK_V3, setLOADBANK_V3,
    LOADBANK_P1, setLOADBANK_P1,
    LOADBANK_P2, setLOADBANK_P2,
    LOADBANK_P3, setLOADBANK_P3,
    isStep1Complete, setIsStep1Complete,
    isStep2Complete, setIsStep2Complete,
    setIsStep3Complete,
    setIsStep4Complete,
    setIsStep5Complete,
    setIsStep6Complete,
    setIsStep7Complete,
    setIsStep8Complete,
    setIsStep9Complete,
    setIsStep10Complete,
  } = useMessage();

  useEffect(() => {
    console.log("Socket state güncellendi:", socket);
  }, [socket]);

  const send_ac_charger_connect_request = (socket : W3CWebSocket) => {
    if (socket) {
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({
            Command: "ACChargerConnectRequest",
            Data: "",
          })
        );
      } else {
        toast.error("Server'a bağlanılamıyor!");
      }
    } else {
      toast.error("Server'a bağlanılamıyor!");
    }
  }

  const handleBarcodeInput = (event: KeyboardEvent) => {
    // console.log("event.key", event.key, "expectedBarcodeType", expectedBarcodeType)
    if (!expectedBarcodeType) return;

    if (event.key === "Shift") return;

    if (event.key === "ç") {
      setBarcode((prev) => prev + ".");
      return;
    }

    if (event.key === "Enter") {
      if (debounceId) clearTimeout(debounceId);
      processBarcode();
      if (timeoutId) clearTimeout(timeoutId);
    } else {
      setBarcode((prev) => prev + event.key);
      if (debounceId) clearTimeout(debounceId);
      // const newDebounceId = setTimeout(() => console.log("Debounced barcode:", barcode), 300);
      // setDebounceId(newDebounceId);
    }
  };

  const sendBarcode = (command: string) => {
    if (socket) {
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({
            Command: command,
            Data: barcode,
          })
        );
      } else {
        toast.error("Server'a bağlanılamıyor!");
      }
    } else {
      toast.error("Server'a bağlanılamıyor!");
    }
  };

  const processBarcode = () => {
    if (barcode.trim() === "") {
      handleAddItem("Barkod girilmedi. Hata!", false);
    } else if (expectedBarcodeType === "seriNo") {
      handleAddItem(`Cihaz Seri No: ${barcode}`, true, null, 1);
      setIsStep1Complete(true)
      sendBarcode("SeriNoBarcode");
      handleAddItem("Cihazın Model Idsi sorgulanıyor...", null, null, 2);
      setBarcode("");
    } else if (expectedBarcodeType === "chargePointId") {
      if (barcode.startsWith("HCAC") && barcode.length === 10) {
        handleAddItem(`Charge Point ID: ${barcode}`, true, null, 3);
        setIsStep3Complete(true)
        sendBarcode("ChargePointIdBarcode");
        setBarcode("");
      } else {
        toast.error(`Geçersiz barkod! : ${barcode}`)
        handleAddItem("Lütfen cihazın Charge Point Id barkodunu okutunuz!", null, null, 3);
        setBarcode("");
        setWaitingForBarcode(true);
      }
    }
  };

  const startTimeout = () => {
    // console.log("startTimeout")
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      // console.log("setTimeout")
      if (expectedBarcodeType) {
        // console.log("expectedBarcodeType")
      }
      if (!barcode) {
        handleAddItem("Barkod girilmedi. Hata!", false);
      }
    }, 3600000);
    setTimeoutId(id);
  };


  useEffect(() => {
    if (waitingForBarcode) {
      window.addEventListener("keydown", handleBarcodeInput);
      startTimeout();
    } else {
      window.removeEventListener("keydown", handleBarcodeInput);
      if (timeoutId) clearTimeout(timeoutId);
    }

    return () => {
      window.removeEventListener("keydown", handleBarcodeInput);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [waitingForBarcode, barcode]);


  const Tick = () => {
    return <img className="tick" src="/assets/img/tik.png" alt="" />
  };


  const connectWebSocket = () => {
    const newSocket = new W3CWebSocket('ws://' + window.location.hostname + ':4000');

    newSocket.onopen = () => {
        console.log("WebSocket bağlantısı kuruldu.");
        setIsConnecting(false);
    };

    newSocket.onmessage = (message) => {
        try {
            const jsonData = JSON.parse(message.data.toString());
            if (jsonData.Command != "LoadData" && jsonData.Command != "USBList"){
              console.log(jsonData)
            }
            
            switch (jsonData.Command) {
              case "LoadData":
                setLOADBANK_I1(jsonData.Data.LOADBANK_I1)
                setLOADBANK_I2(jsonData.Data.LOADBANK_I2)
                setLOADBANK_I3(jsonData.Data.LOADBANK_I3)
                setLOADBANK_V1(jsonData.Data.LOADBANK_V1)
                setLOADBANK_V2(jsonData.Data.LOADBANK_V2)
                setLOADBANK_V3(jsonData.Data.LOADBANK_V3)
                setLOADBANK_P1(jsonData.Data.LOADBANK_P1)
                setLOADBANK_P2(jsonData.Data.LOADBANK_P2)
                setLOADBANK_P3(jsonData.Data.LOADBANK_P3)
                break
              case "USBList":
                setUSBList(jsonData.Data)
                break
              case "Config":
                //handleAddItem("SMART FONKSIYON ve BAĞLANTI TESTLERİ", null, "header", 1);
                if (jsonData.Data) {
                  const newSelectedUSB = jsonData.Data.selectedUSB || "";
                  console.log("Config'den gelen USB:", newSelectedUSB);
                  setSelectedUSB(newSelectedUSB);
                  setwifiSSID(jsonData.Data.wifiSSID || "");
                  setwifiPassword(jsonData.Data.wifiPassword || "");
                  setfourG_apn(jsonData.Data.fourG_apn || "");
                  setfourG_user(jsonData.Data.fourG_user || "");
                  setfourG_password(jsonData.Data.fourG_password || "");
                  setfourG_pin(jsonData.Data.fourG_pin || "");
                }
                break
              case "USBControl":
                if (jsonData.Data) {
                  toast.success("Test cihazına bağlandı.")
                  setExpectedBarcodeType("seriNo")
                }
                else {
                  toast.error("Test cihazına bağlanamadı!")
                }
                break
              case "SeriNoRequest":
                handleAddItem("Lütfen cihazın seri numara barkodunu okutunuz!", null, null, 1);
                setWaitingForBarcode(true);
                break
              case "SeriNoBarcodeResult":
                if (jsonData.Data) {
                  if (jsonData.Data.result) {
                    const deviceInfo = [
                      `ItemCode: ${jsonData.Data.ItemCode}\n`,
                      `emergencyButton: ${jsonData.Data.emergencyButton}\n`,
                      `midMeter: ${jsonData.Data.midMeter}\n`,
                      `system: ${jsonData.Data.system}\n`,
                      `bodyColor: ${jsonData.Data.bodyColor}\n`,
                      `connectorType: ${jsonData.Data.connectorType}\n`,
                      `caseType: ${jsonData.Data.caseType}\n`
                    ].join('');
                    handleAddItem(deviceInfo, null, null, 2, "20px");
                    setIsStep2Complete(true)
                  }
                  else {
                    toast.error("SAP sisteminde bir sorun oluştu!")
                    //handleAddItem("SAP sisteminde bir sorun oluştu!", false, null, null, "14px");
                  }
                }
                break
              case "ChargePointIdRequest":
                setBarcode("")
                setExpectedBarcodeType("chargePointId")
                handleAddItem("Lütfen cihazın Charge Point Id barkodunu okutunuz!", null, null, 3);
                setWaitingForBarcode(true);
                break
              case "WaitDevice":
                handleAddItem("Test cihazının hazır olması bekleniyor...", null, null, 4);
                break
              case "WaitDeviceResult":
                handleAddItem("Test cihazı hazır.", true, null, 4);
                setIsStep4Complete(true)
                send_ac_charger_connect_request(newSocket)
                handleAddItem("AC Charger'a bağlanılıyor...", null, null, 5);
                break
              case "ACChargerConnectResult":
                if(jsonData.Data){
                  handleAddItem("AC Charger'a bağlandı.", true, null, 5);
                  setIsStep5Complete(true)
                } else {
                  handleAddItem("AC Charger'a bağlanılamadı!", false, null, 5);
                }
                break
              case "MasterCardRequest":
                handleAddItem("Lütfen master katı cihaza okutunuz!", null, null, 7);
                break
              case "MasterCardResult":
                if (jsonData.Data == "" || jsonData.Data == null){
                  handleAddItem("Master kart alınamadı " + jsonData.Data, false, null, 7);
                  setIsStep7Complete(false)
                }
                else{
                  handleAddItem("Master kart kayıt edildi:" + jsonData.Data, true, null, 7);
                  setIsStep7Complete(true)
                }
                break
              case "User1CardRequest":
                handleAddItem("Lütfen birinci kullanıcı katını cihaza okutunuz!", null, null, 8)
                break
              case "User2CardRequest":
                handleAddItem("Lütfen ikinci kullanıcı katını cihaza okutunuz!", null, null, 9)
                break
              case "User1CardResult":
                if (jsonData.Data == "Same"){
                  handleAddItem("Aynı kartı okuttunuz!", false, null, 8)
                }
                else if (jsonData.Data == "" || jsonData.Data == null){
                  handleAddItem("Birinci kullanıcı kart alınamadı " + jsonData.Data, false, null, 8)
                  setIsStep8Complete(false)
                }
                else{
                  handleAddItem("Birinci kullanıcı kayıt edildi:" + jsonData.Data, true, null, 8)
                  setIsStep8Complete(true)
                }
                break
              case "User2CardResult":
                if (jsonData.Data == "Same"){
                  handleAddItem("Aynı kartı okuttunuz!", false, null, 9)
                }
                else if (jsonData.Data == "" || jsonData.Data == null){
                  handleAddItem("İkinci kullanıcı kart alınamadı " + jsonData.Data, false, null, 9)
                  setIsStep9Complete(false)
                }
                else{
                  handleAddItem("İkinci kullanıcı kayıt edildi: " + jsonData.Data, true, null , 9)
                  setIsStep9Complete(true)
                }
                break
              case "WaitConfigResult":
                const waitconfig = [
                  `AC Şarj cihazının 4G'li model ise 4G'ye bağlanması bekleniyor...\n`,
                  `AC Şarj cihazının Wifiye bağlanması bekleniyor...\n`,
                  `AC Şarj cihazının Bluetooth adı charge point id ile değiştiriliyor...\n`,
                  `AC Şarj cihazının Ethernet MAC Adresi alınıyor...\n`,
                  `AC Şarj cihazının MCU hata durumu sorgulanıyor...\n`,
                  `AC Şarj cihazının 4G'li model ise 4G imei numarası alınıyor...\n`
                ].join('');
                handleAddItem(waitconfig, null, null, 10, "15px");
                break
              case "ACChargerNotConnected":
                handleAddItem("AC Şarj cihazından cevap alınamadı!", false)
                break
              case "SaveConfigResult":
                const results = [];
                
                // Bluetooth MAC kontrolü
                if (jsonData.Data.bluetooth_mac) {
                  results.push(`✓ Bluetooth mac adresi: ${jsonData.Data.bluetooth_mac}`);
                } else {
                  results.push(`✗ Bluetooth mac adresi alınamadı!`);
                }

                // Ethernet MAC kontrolü
                if (jsonData.Data.eth_mac) {
                  results.push(`✓ Ethernet mac adresi: ${jsonData.Data.eth_mac}`);
                } else {
                  results.push(`✗ Ethernet mac adresi alınamadı!`);
                }

                // MCU hata kontrolü
                if (jsonData.Data.mcu_error.length === 0) {
                  results.push(`✓ MCU'da hata yok`);
                } else {
                  results.push(`✗ MCU hataları: ${jsonData.Data.mcu_error.join(', ')}`);
                }

                // MCU bağlantı kontrolü
                if (jsonData.Data.mcu_connection) {
                  results.push(`✓ MCU bağlı`);
                } else {
                  results.push(`✗ MCU bağlı değil!`);
                }

                // 4G kontrolü
                if (jsonData.Data.fourg) {
                  if (jsonData.Data.imei_4g) {
                    results.push(`✓ 4G imei adresi: ${jsonData.Data.imei_4g}`);
                  } else {
                    results.push(`✗ 4G imei adresi alınamadı!`);
                  }
                }

                // WiFi bağlantı kontrolü
                if (jsonData.Data.wlan0_connection) {
                  results.push(`✓ Wifi bağlantısı başarılı`);
                } else {
                  results.push(`✗ Wifi'ye bağlanamadı!`);
                }

                // Tüm sonuçları tek mesajda göster
                const allTestsPassed = !results.some(result => result.startsWith('✗'));
                handleAddItem(results.join('\n'), allTestsPassed, null, 10, "15px");
                setIsStep10Complete(allTestsPassed);
                break
              case "ChargeTest":
                //handleAddItem("ŞARJ TESTİ BAŞLADI", null, "header");
                //handleAddItem("Lütfen kablonun takılı olduğundan emin olunuz!", null)
                break
              case "DeviceB":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı B konumuna getirildi", true, null, 12)
                } else{
                  handleAddItem("Şarj cihazı B konumuna getirilemedi", true, null, 12)
                }
                break
              case "WaitUser1CardRequest":
                handleAddItem("Lütfen birinci kullanıcı RFID kartını okutunuz!", null)
                break
              case "AgainTest":
                handleAddItem("Test işleminde hata var lütfen kontrol edip tekrar test ediniz!", false)
                break
              case "WaitUser1CardResult":
                if(jsonData.Data){
                  handleAddItem("Birinci kullanıcı kartı okutuldu", true)
                } else{
                  handleAddItem("Birinci kullanıcı kartı okutulamadı!", false)
                }
                break
              case "WaitUser2CardResult":
                if(jsonData.Data){
                  handleAddItem("İkinci kullanıcı kartı okutuldu", true)
                } else{
                  handleAddItem("İkinci kullanıcı kartı okutulamadı!", false)
                }
                break
              case "WaitRelayOnRequest":
                handleAddItem("Rölenin On olması bekleniyor...", null)
                break
              case "WaitRelayOnResult":
                if(jsonData.Data){
                  handleAddItem("Röle On oldu. Yük bankası devrede.",true)
                } else{
                  handleAddItem("Röle On olmadı!",false)
                }
                break
              case "ControlVoltageRequest":
                handleAddItem("Voltaj değerleri 5 saniye boyunca kontrol ediliyor...",null)
                break
              case "ControlVoltage":
                if(jsonData.Data){
                  handleAddItem("Voltaj değerleri kontrol edildi doğrulandı.",true)
                } else{
                  handleAddItem("Voltaj değerleri sınırı aşmıştır! Test durduruldu.",false)
                }
                break
              case "ControlCurrentRequest":
                handleAddItem("Akım değerleri 5 saniye boyunca kontrol ediliyor...",null)
                break
              case "ControlCurrent":
                if(jsonData.Data){
                  handleAddItem("Akım değerleri kontrol edildi doğrulandı.",true)
                } else{
                  handleAddItem("Akım değerleri sınırı aşmıştır! Test durduruldu.",false)
                }
                break
              case "ControlAllValues30sn":
                handleAddItem("30 sn içerisinde de test cihazının ve şarj cihazının okuduğu akım, gerilim ve güç değerleri karşılaştırılır...",null)
                break
              case "ControlAllValues30snResult":
                if(jsonData.Data){
                  handleAddItem("Akım, Voltaj ve Güç değerleri kontrol edildi doğrulandı.",true)
                } else{
                  handleAddItem("Akım, Voltaj ve Güç değerleri sınırı aşmıştır! Test durduruldu.",false)
                }
                break
              case "OverCurrentTest":
                handleAddItem("AŞIRI AKIM TESTİ", null, "header")
                break
              case "OverCurrentTestResult":
                setmcu_error("")
                if (jsonData.Data.length != 0){
                  jsonData.Data.forEach((error: string, index: number) => {
                    handleAddItem("MCU'da hata: " + error, true)
                  });
                }
                else{
                  handleAddItem("MCU'da hata yok!" , false)
                }
                break
              case "RCDLeakageCurrentSet":
                handleAddItem("Şarj Cihazının RCD hatasına geçmesi bekleniyor..." , null)
                break
              case "RCDLeakageCurrentTestResult":
                if (jsonData.Data.length != 0){
                  jsonData.Data.forEach((error: string, index: number) => {
                    handleAddItem("MCU'da hata: " + error, true)
                  });
                }
                else{
                  handleAddItem("MCU'da hata yok!" , false)
                }
                break
              case "WaitAState":
                handleAddItem("Şarj cihazının 5 sn içerisinde A state'ine geçmesi bekleniyor..." , null)
                break
              case "WaitAStateResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı A state'ine geçti.",true)
                } else{
                  handleAddItem("Şarj cihazı 5 sn içerisinde A statine geçemedi!",false)
                }
                break
              case "WaitCState":
                handleAddItem("Şarj cihazının 40 sn içerisinde C state'ine geçmesi bekleniyor..." , null)
                break
              case "WaitCStateResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı tekrar C state'ine geçti.",true)
                } else{
                  handleAddItem("Şarj cihazı 40 sn içerisinde C statine geçemedi!",false)
                }
                break
              case "RCDLeakageCurrentTest":
                handleAddItem("RCD KAÇAK AKIM TESTİ", null, "header")
                break
              case "SecondUserCard":
                handleAddItem("İKİNCİ RFID KARTININ TESTİ", null, "header")
                handleAddItem("Şarj cihazı B statine getirildi.",true)
                // handleAddItem("Şarjı Başlatmak İçin İkinci Kullanıcı RFID Kartını Okutunuz!",null)
                break
              case "WaitUser2CardRequest":
                handleAddItem("Lütfen birinci kullanıcı RFID kartını okutunuz!", null)
                break
              case "SecondUserWaitCStateResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı tekrar C state'ine geçti.",true)
                } else{
                  handleAddItem("Şarj cihazı C state'ine geçemedi!",false)
                }
                break
              case "EndTest":
                handleAddItem("TESTİN SONLANDIRILMASI", null, "header")
                break
              case "SapResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı SAP sistemine başarılı kayıt edildi.",true)
                } else{
                  handleAddItem("Şarj cihazı SAP sistemine başarılı kayıt edilemedi!",false)
                }
                break
      
                // Diğer case'ler...
            }
        } catch (error) {
            console.error("Mesaj işleme hatası:", error);
        }
    };

    newSocket.onerror = (error) => {
        console.error("WebSocket hatası:", error);
        setIsConnecting(false);
    };

    newSocket.onclose = () => {
        console.log("WebSocket bağlantısı kapandı");
        setIsConnecting(false);
        setTimeout(() => connectWebSocket(), 1000);
    };

    setSocket(newSocket);
    return newSocket;
  };

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
        if (ws.readyState === ws.OPEN) {
            ws.close();
        }
    };
  }, []);

  return <div></div>;
};

export default WebSocketComponent;