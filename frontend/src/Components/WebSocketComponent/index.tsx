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

interface WebSocketComponentProps {
    handleAddItem: (message: string, isSuccess: boolean | null, type?: string | null, step?: number, fontSize?: string) => void;
    isDisabled: boolean;
    setIsDisabled: (value: boolean) => void;
    setProductInfoList: (data: ProductInfo[]) => void;
    setActivePage: (page: number) => void;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ handleAddItem, isDisabled, setIsDisabled, setProductInfoList, setActivePage }) => {
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
    isStep3Complete, setIsStep3Complete,
    isStep4Complete, setIsStep4Complete,
    isStep5Complete, setIsStep5Complete,
    isStep6Complete, setIsStep6Complete,
    isStep7Complete, setIsStep7Complete,
    isStep8Complete, setIsStep8Complete,
    isStep9Complete, setIsStep9Complete,
    isStep10Complete, setIsStep10Complete,
    isStep11Complete, setIsStep11Complete,
    isStep12Complete, setIsStep12Complete,
    isStep13Complete, setIsStep13Complete,
    isStep14Complete, setIsStep14Complete,
    isStep15Complete, setIsStep15Complete,
    isStep16Complete, setIsStep16Complete,
    isStep17Complete, setIsStep17Complete,
    isStep18Complete, setIsStep18Complete,
    isStep19Complete, setIsStep19Complete,
    isStep20Complete, setIsStep20Complete,
    isStep21Complete, setIsStep21Complete,
    isStep22Complete, setIsStep22Complete,
    isStep23Complete, setIsStep23Complete,
    isStep24Complete, setIsStep24Complete,
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
              case "MCUFirmwareUpdateRequest":
                handleAddItem("MCU firmware güncelleniyor...", null, null, 6);
                break
              case "MCUFirmwareUpdateResult":
                if(jsonData.Data){
                  handleAddItem("MCU firmware güncellendi.", true, null, 6);
                  setIsStep6Complete(true)
                } else {
                  handleAddItem("MCU firmware güncellenemedi!", false, null, 6);
                  setIsStep6Complete(false)
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
              case "BluetoothKeyRequest":
                handleAddItem("Bluetooth key üretiliyor...", null, null, 11);
                break
              case "BluetoothKeyResult":
                if (jsonData.Data) {
                  const bluetoothInfo = [
                    `✓ Bluetooth Key: ${jsonData.Data.bluetooth_key}`,
                    `✓ Bluetooth IV Key: ${jsonData.Data.bluetooth_iv_key}`,
                    `✓ Bluetooth Password: ${jsonData.Data.bluetooth_password}`
                  ].join('\n');
                  handleAddItem(bluetoothInfo, true, null, 11, "15px");
                  setIsStep11Complete(true);
                } else {
                  handleAddItem("Bluetooth key üretilemedi!", false, null, 11);
                  setIsStep11Complete(false);
                }
                break
              case "ChargeTest":
                //handleAddItem("ŞARJ TESTİ BAŞLADI", null, "header");
                handleAddItem("Lütfen kablonun takılı olduğundan emin olunuz!", null, null, 12)
                break
              case "DeviceB":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı B konumuna getirildi", true, null, 12)
                  setIsStep12Complete(true)
                } else{
                  handleAddItem("Şarj cihazı B konumuna getirilemedi", false, null, 12)
                  setIsStep12Complete(false)
                }
                break
              case "WaitUser1CardRequest":
                handleAddItem("Lütfen birinci kullanıcı RFID kartını okutunuz!", null, null, 13)
                break
              case "AgainTest":
                handleAddItem("Test işleminde hata var lütfen kontrol edip tekrar test ediniz!", false)
                break
              case "WaitUser1CardResult":
                if(jsonData.Data){
                  handleAddItem("Birinci kullanıcı kartı okutuldu", true, null, 13)
                  setIsStep13Complete(true)
                } else{
                  handleAddItem("Birinci kullanıcı kartı okutulamadı!", false, null, 13)
                  setIsStep13Complete(false)
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
                handleAddItem("Rölenin On olması bekleniyor...", null, null, 14)
                break
              case "WaitRelayOnResult":
                if(jsonData.Data){
                  handleAddItem("Röle On oldu. Yük bankası devrede.",true, null, 14)
                  setIsStep14Complete(true)
                } else{
                  handleAddItem("Röle On olmadı!",false, null, 14)
                  setIsStep14Complete(false)
                }
                break
              case "ControlVoltageChargeTestRequest":
                handleAddItem("Voltaj değerleri 5 saniye boyunca kontrol ediliyor...",null, null, 15)
                break
              case "ControlVoltageChargeTestResult":
                if(jsonData.Data){
                  handleAddItem("Voltaj değerleri kontrol edildi doğrulandı.",true, null, 15)
                  setIsStep15Complete(true)
                } else{
                  handleAddItem("Voltaj değerleri sınırı aşmıştır! Test durduruldu.",false, null, 15)
                  setIsStep15Complete(false)
                }
                break
              case "ControlVoltageRCDRequest":
                handleAddItem("Voltaj değerleri 5 saniye boyunca kontrol ediliyor...",null, null, 20)
                break
              case "ControlVoltageRCDResult":
                if(jsonData.Data){
                  handleAddItem("Voltaj değerleri kontrol edildi doğrulandı.",true, null, 20)
                  setIsStep20Complete(true)
                } else{
                  handleAddItem("Voltaj değerleri sınırı aşmıştır! Test durduruldu.",false, null, 20)
                  setIsStep20Complete(false)
                }
                break
              case "ControlCurrentRequest":
                handleAddItem("Akım değerleri 5 saniye boyunca kontrol ediliyor...",null, null, 16)
                break
              case "ControlCurrent":
                if(jsonData.Data){
                  handleAddItem("Akım değerleri kontrol edildi doğrulandı.",true, null, 16)
                  setIsStep16Complete(true)
                } else{
                  handleAddItem("Akım değerleri sınırı aşmıştır! Test durduruldu.",false, null, 16)
                  setIsStep16Complete(false)
                }
                break
              case "ControlAllValues30sn":
                handleAddItem("30 sn içerisinde de test cihazının ve şarj cihazının okuduğu akım, gerilim ve güç değerleri karşılaştırılır...",null, null, 17, "30px")
                break
              case "ControlAllValues30snResult":
                if(jsonData.Data){
                  handleAddItem("Akım, Voltaj ve Güç değerleri kontrol edildi doğrulandı.",true, null, 17)
                  setIsStep17Complete(true)
                } else{
                  handleAddItem("Akım, Voltaj ve Güç değerleri sınırı aşmıştır! Test durduruldu.",false, null, 17)
                  setIsStep17Complete(false)
                }
                break
              case "OverCurrentTest":
                handleAddItem("Aşırı akım testi başlatılıyor...", null, null, 18)
                break
              case "OverCurrentTestResult":
                setmcu_error("")
                if (jsonData.Data.length != 0){
                  const messageMCU = "Aşırı akım testi sırasında MCU'da hata: " + jsonData.Data.join(", ");
                  handleAddItem(messageMCU, true, null, 18);
                  setIsStep18Complete(true)
                }
                else{
                  handleAddItem("Aşırı akım testi sırasında MCU'da hata yok!" , false, null, 18)
                  setIsStep18Complete(false)
                }
                break
              case "RCDLeakageCurrentSet":
                handleAddItem("Şarj Cihazının RCD hatasına geçmesi bekleniyor..." , null, null, 21)
                break
              case "RCDLeakageCurrentTestResult":
                if (jsonData.Data.length != 0){
                  const messageRCD = "RCD kaçak akım testi sırasında MCU'da hata: " + jsonData.Data.join(", ");
                  handleAddItem(messageRCD, true, null, 21);
                  setIsStep21Complete(true)
                }
                else{
                  handleAddItem("RCD kaçak akım testi sırasında MCU'da hata yok!" , false, null, 21)
                  setIsStep21Complete(false)
                }
                break
              case "WaitAState":
                handleAddItem("Şarj cihazının 5 sn içerisinde A state'ine geçmesi bekleniyor..." , null, null, 22)
                break
              case "WaitAStateResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı A state'ine geçti.",true, null, 22)
                  setIsStep22Complete(true)
                } else{
                  handleAddItem("Şarj cihazı 5 sn içerisinde A statine geçemedi!",false, null, 22)
                  setIsStep22Complete(false)
                }
                break
              case "WaitCState":
                handleAddItem("Şarj cihazının 40 sn içerisinde C state'ine geçmesi bekleniyor..." , null, null, 19)
                break
              case "WaitCStateResult":
                if(jsonData.Data){
                  handleAddItem("Şarj cihazı tekrar C state'ine geçti.",true, null, 19)
                  setIsStep19Complete(true)
                } else{
                  handleAddItem("Şarj cihazı 40 sn içerisinde C statine geçemedi!",false, null, 19)
                  setIsStep19Complete(false)
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
                  handleAddItem("Şarj cihazı SAP sistemine başarılı kayıt edildi.",true, null, 23)
                  setIsStep23Complete(true)
                  setActivePage(24)
                } else{
                  handleAddItem("Şarj cihazı SAP sistemine başarılı kayıt edilemedi!",false, null, 23)
                  setIsStep23Complete(false)
                  setActivePage(24)
                }
                break
              case "ProductInfoList":
                if (jsonData.Data) {
                    setProductInfoList(jsonData.Data);
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