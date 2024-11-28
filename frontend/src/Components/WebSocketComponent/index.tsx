import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useNavigate } from "react-router-dom";
import LoadingProduct from "../../assets/icons/loadingProduct.svg";
import { useMessage } from '../../Components/MessageContext';
import { toast } from "react-toastify";

interface Item {
  message: string;
  isSuccess: boolean | null;
}

type BarcodeType = "seriNo" | "chargePointId";

const WebSocketComponent = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const navigate = useNavigate();
  const [waitingForBarcode, setWaitingForBarcode] = useState(false);
  const [barcode, setBarcode] = useState("");
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
    items,
    setItems, timeoutId, setTimeoutId,
    containerRef,
  } = useMessage();

  useEffect(() => {
    console.log("change socket --------------",socket)
  }, [socket]);


  const handleAddItem = (message: string, isSuccess: boolean | null) => {
    setItems((prevItems: Item[]) => [
      ...prevItems,
      { message, isSuccess },
    ]);

    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
      }, 0);
    }
  };

  const handleBarcodeInput = (event: KeyboardEvent) => {
    console.log("event.key", event.key, "expectedBarcodeType", expectedBarcodeType)
    if (!expectedBarcodeType) return;

    if (event.key === "Shift") return;

    if (event.key === "ç") {
      setBarcode((prev) => prev + ".");
      return;
    }

    if (event.key === "Enter") {
      console.log("event.key === Enter")
      if (debounceId) clearTimeout(debounceId);
      processBarcode();
      if (timeoutId) clearTimeout(timeoutId);
    } else {
      setBarcode((prev) => prev + event.key);
      console.log("debounceId", debounceId)
      if (debounceId) clearTimeout(debounceId);
      const newDebounceId = setTimeout(() => console.log("Debounced barcode:", barcode), 300);
      console.log("newDebounceId", newDebounceId)
      setDebounceId(newDebounceId);
    }
  };

  const sendBarcode = (command: string) => {
    console.log(socket)
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


  const send_connect_ac_charger_request = () => {
    console.log("send_connect_ac_charger_request",socket)
    // connectWebSocket();
    // console.log(socket)
    // console.log("Socket state:", socket);
    // if (socket && socket.readyState === socket.OPEN) {
    //     socket.send(
    //         JSON.stringify({
    //             Command: "ACChargerConnectRequest",
    //             Data: "",
    //         })
    //     );
    //     console.log("AC Charger bağlantı isteği gönderildi.");
    // } else {
    //     toast.error("WebSocket bağlantısı hazır değil. Tekrar bağlanıyor...");
    //     // setTimeout(() => send_connect_ac_charger_request(), 1000);
    // }
};


  const processBarcode = () => {
    console.log("processBarcode aşaması")
    console.log("barcode", barcode)
    if (barcode.trim() === "") {
      handleAddItem("Barkod girilmedi. Hata!", false);
    } else if (expectedBarcodeType === "seriNo") {
      handleAddItem(`Cihaz Seri No: ${barcode}`, true);
      sendBarcode("SeriNoBarcode");
      handleAddItem("Cihazın Model Idsi sorgulanıyor...", null);
    } else if (expectedBarcodeType === "chargePointId") {
      handleAddItem(`Charge Point ID: ${barcode}`, true);
      sendBarcode("ChargePointIdBarcode");
    }
  };

  const startTimeout = () => {
    console.log("startTimeout")
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      console.log("setTimeout")
      if (expectedBarcodeType) {
        console.log("expectedBarcodeType")
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
    console.log("Web", isConnecting)
    setIsConnecting(true);
    const newSocket = new W3CWebSocket('ws://' + window.location.hostname + ':4000');

    newSocket.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu.");
      navigate("");
      setSocket(newSocket);
      setIsConnecting(false);
    };

    newSocket.onmessage = (message) => {
      const jsonData = JSON.parse(message.data.toString());
      switch (jsonData.Command) {
        case "USBList":
          setUSBList(jsonData.Data)
          break
        case "Config":
          console.log(jsonData);
          if (jsonData.Data) {
            setwifiSSID(jsonData.Data.wifiSSID)
            setwifiPassword(jsonData.Data.wifiPassword)
            setfourG_apn(jsonData.Data.fourG_apn)
            setfourG_user(jsonData.Data.fourG_user)
            setfourG_password(jsonData.Data.fourG_password)
            setfourG_pin(jsonData.Data.fourG_pin)
          }
          break
        case "USBControl":
          console.log(jsonData);
          if (jsonData.Data) {
            console.log("Test cihazına bağlandı")
            handleAddItem("Test cihazına bağlandı.", true)
            setExpectedBarcodeType("seriNo")
            handleAddItem("Lütfen cihazın seri numara barkodunu okutunuz!", null);
            setWaitingForBarcode(true);
          }
          else {
            console.log("Test cihazına bağlanamadı")
            handleAddItem("Test cihazına bağlanamadı!.", false)
          }
          break
        case "SeriNoBarcodeResult":
          console.log(jsonData);
          if (jsonData.Data) {
            if (jsonData.Data.result) {
              handleAddItem(`ItemCode: ${jsonData.Data.ItemCode}`, null);
              handleAddItem(`emergencyButton: ${jsonData.Data.emergencyButton}`, null);
              handleAddItem(`midMeter: ${jsonData.Data.midMeter}`, null);
              handleAddItem(`system: ${jsonData.Data.system}`, null);
              handleAddItem(`bodyColor: ${jsonData.Data.bodyColor}`, null);
              handleAddItem(`connectorType: ${jsonData.Data.connectorType}`, null);
              handleAddItem(`caseType: ${jsonData.Data.caseType}`, null);
            }
            else {
              handleAddItem("SAP sisteminde bir sorun oluştu!", false)
            }
          }
          break
        case "ChargePointIdRequest":
          console.log(jsonData);
          setBarcode("")
          setExpectedBarcodeType("chargePointId")
          handleAddItem("Lütfen cihazın Charge Point Id barkodunu okutunuz!", null);
          setWaitingForBarcode(true);
          break
        case "WaitDevice":
          console.log(jsonData);
          send_connect_ac_charger_request()
          handleAddItem("Test cihazının hazır olması bekleniyor...", null)
          break
        case "WaitDeviceResult":
          console.log(jsonData);
          
          if (jsonData.Data) {
            handleAddItem("Test cihazı hazır.", true)
            send_connect_ac_charger_request()
            handleAddItem("AC Charger'a bağlanılıyor...", true)
          }
          
      }
    };

    newSocket.onerror = (error) => {
      setSocket(newSocket);
      console.error("WebSocket hatası:------------------------------------------------------", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket bağlantısı kapatıldı.--------------------------------------------------------------");
      setSocket(newSocket);
      setIsConnecting(false);

      setTimeout(() => {
        connectWebSocket();
      }, 1000);
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("connectWebSocket...")
        connectWebSocket();
      } catch (error) {
        console.error("Error fetching data:-------------------------------------------------------", error);
      }
    };

    fetchData();

    return () => {
      if (socket) {
        console.log("WebSocket bağlantısı kapatıldı.-------------------------------------------");
        socket.close();
      }
    };
  }, []);

  return <div></div>;
};

export default WebSocketComponent;
