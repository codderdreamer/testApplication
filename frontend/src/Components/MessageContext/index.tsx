import React, {useRef, createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

export interface Item {
  message: string;
  isSuccess: boolean | null;
  type: string | null;
}

interface MessageContextType {
  socket: W3CWebSocket | null;
  setSocket: (socket: W3CWebSocket | null) => void;

  USBList: string[];
  setUSBList: (USBList: string[]) => void;

  wifiSSID: string;
  setwifiSSID: (wifiSSID: string) => void;

  wifiPassword: string;
  setwifiPassword: (wifiPassword: string) => void;

  fourG_apn: string;
  setfourG_apn: (fourG_apn: string) => void;

  fourG_user: string;
  setfourG_user: (fourG_user: string) => void;

  fourG_password: string;
  setfourG_password: (fourG_password: string) => void;

  fourG_pin: string;
  setfourG_pin: (fourG_pin: string) => void;

  selectedUSB: string;
  setSelectedUSB: (selectedUSB: string) => void;

  items: Item[];
  setItems: (items: Item[] | ((prevItems: Item[]) => Item[])) => void;

  containerRef: React.RefObject<HTMLDivElement>;

  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: Dispatch<SetStateAction<NodeJS.Timeout | null>>;

  LOADBANK_I1: string;
  setLOADBANK_I1: (LOADBANK_I1: string) => void;

  LOADBANK_I2: string;
  setLOADBANK_I2: (LOADBANK_I2: string) => void;

  LOADBANK_I3: string;
  setLOADBANK_I3: (LOADBANK_I3: string) => void;

  LOADBANK_V1: string;
  setLOADBANK_V1: (LOADBANK_V1: string) => void;

  LOADBANK_V2: string;
  setLOADBANK_V2: (LOADBANK_V2: string) => void;

  LOADBANK_V3: string;
  setLOADBANK_V3: (LOADBANK_V3: string) => void;

  LOADBANK_P1: string;
  setLOADBANK_P1: (LOADBANK_P1: string) => void;

  LOADBANK_P2: string;
  setLOADBANK_P2: (LOADBANK_P2: string) => void;

  LOADBANK_P3: string;
  setLOADBANK_P3: (LOADBANK_P3: string) => void;
  


  // networkjsonString: string | null;
  // setNetworkPriority:(networkjsonString: string | null) => void;
  
  deviceConnected: boolean;
  setDeviceConnected: (deviceConnected: boolean) => void;

  isStep1Complete: boolean | null;
  setIsStep1Complete: (value: boolean | null) => void;
  isStep2Complete: boolean | null;
  setIsStep2Complete: (value: boolean | null) => void;
  isStep3Complete: boolean | null;
  setIsStep3Complete: (value: boolean | null) => void;
  isStep4Complete: boolean | null;
  setIsStep4Complete: (value: boolean | null) => void;
  isStep5Complete: boolean | null;
  setIsStep5Complete: (value: boolean | null) => void;
  isStep6Complete: boolean | null;
  setIsStep6Complete: (value: boolean | null) => void;
  isStep7Complete: boolean | null;
  setIsStep7Complete: (value: boolean | null) => void;
  isStep8Complete: boolean | null;
  setIsStep8Complete: (value: boolean | null) => void;
  isStep9Complete: boolean | null;
  setIsStep9Complete: (value: boolean | null) => void;
  isStep10Complete: boolean | null;
  setIsStep10Complete: (value: boolean | null) => void;
  isStep11Complete: boolean | null;
  setIsStep11Complete: (value: boolean | null) => void;
  isStep12Complete: boolean | null;
  setIsStep12Complete: (value: boolean | null) => void;
  isStep13Complete: boolean | null;
  setIsStep13Complete: (value: boolean | null) => void;
  isStep14Complete: boolean | null;
  setIsStep14Complete: (value: boolean | null) => void;
  isStep15Complete: boolean | null;
  setIsStep15Complete: (value: boolean | null) => void;
  isStep16Complete: boolean | null;
  setIsStep16Complete: (value: boolean | null) => void;
  isStep17Complete: boolean | null;
  setIsStep17Complete: (value: boolean | null) => void;
  isStep18Complete: boolean | null;
  setIsStep18Complete: (value: boolean | null) => void;
  isStep19Complete: boolean | null;
  setIsStep19Complete: (value: boolean | null) => void;
  isStep20Complete: boolean | null;
  setIsStep20Complete: (value: boolean | null) => void;
  isStep21Complete: boolean | null;
  setIsStep21Complete: (value: boolean | null) => void;
  isStep22Complete: boolean | null;
  setIsStep22Complete: (value: boolean | null) => void;
  isStep23Complete: boolean | null;
  setIsStep23Complete: (value: boolean | null) => void;
  isStep24Complete: boolean | null;
  setIsStep24Complete: (value: boolean | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<W3CWebSocket | null>(null);
  const [USBList, setUSBList] = useState<string[]>([]);
  const [selectedUSB, setSelectedUSB] = useState("");
  const [wifiSSID, setwifiSSID] = useState<string>("");
  const [wifiPassword, setwifiPassword] = useState<string>("");
  const [fourG_apn, setfourG_apn] = useState<string>("");
  const [fourG_user, setfourG_user] = useState<string>("");
  const [fourG_password, setfourG_password] = useState<string>("");
  const [fourG_pin, setfourG_pin] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [LOADBANK_I1, setLOADBANK_I1] = useState<string>("");
  const [LOADBANK_I2, setLOADBANK_I2] = useState<string>("");
  const [LOADBANK_I3, setLOADBANK_I3] = useState<string>("");
  const [LOADBANK_V1, setLOADBANK_V1] = useState<string>("");
  const [LOADBANK_V2, setLOADBANK_V2] = useState<string>("");
  const [LOADBANK_V3, setLOADBANK_V3] = useState<string>("");
  const [LOADBANK_P1, setLOADBANK_P1] = useState<string>("");
  const [LOADBANK_P2, setLOADBANK_P2] = useState<string>("");
  const [LOADBANK_P3, setLOADBANK_P3] = useState<string>("");
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [isStep1Complete, setIsStep1Complete] = useState<boolean | null>(null);
  const [isStep2Complete, setIsStep2Complete] = useState<boolean | null>(null);
  const [isStep3Complete, setIsStep3Complete] = useState<boolean | null>(null);
  const [isStep4Complete, setIsStep4Complete] = useState<boolean | null>(null);
  const [isStep5Complete, setIsStep5Complete] = useState<boolean | null>(null);
  const [isStep6Complete, setIsStep6Complete] = useState<boolean | null>(null);
  const [isStep7Complete, setIsStep7Complete] = useState<boolean | null>(null);
  const [isStep8Complete, setIsStep8Complete] = useState<boolean | null>(null);
  const [isStep9Complete, setIsStep9Complete] = useState<boolean | null>(null);
  const [isStep10Complete, setIsStep10Complete] = useState<boolean | null>(null);
  const [isStep11Complete, setIsStep11Complete] = useState<boolean | null>(null);
  const [isStep12Complete, setIsStep12Complete] = useState<boolean | null>(null);
  const [isStep13Complete, setIsStep13Complete] = useState<boolean | null>(null);
  const [isStep14Complete, setIsStep14Complete] = useState<boolean | null>(null);
  const [isStep15Complete, setIsStep15Complete] = useState<boolean | null>(null);
  const [isStep16Complete, setIsStep16Complete] = useState<boolean | null>(null);
  const [isStep17Complete, setIsStep17Complete] = useState<boolean | null>(null);
  const [isStep18Complete, setIsStep18Complete] = useState<boolean | null>(null);
  const [isStep19Complete, setIsStep19Complete] = useState<boolean | null>(null);
  const [isStep20Complete, setIsStep20Complete] = useState<boolean | null>(null);
  const [isStep21Complete, setIsStep21Complete] = useState<boolean | null>(null);
  const [isStep22Complete, setIsStep22Complete] = useState<boolean | null>(null);
  const [isStep23Complete, setIsStep23Complete] = useState<boolean | null>(null);
  const [isStep24Complete, setIsStep24Complete] = useState<boolean | null>(null);

  // const [networkjsonString, setNetworkPriority] = useState<string | null>(null);
  

  return (
    <MessageContext.Provider value={{socket, setSocket, 
                                    USBList, setUSBList,
                                    selectedUSB, setSelectedUSB,
                                    wifiSSID, setwifiSSID,
                                    wifiPassword, setwifiPassword,
                                    fourG_apn, setfourG_apn,
                                    fourG_user, setfourG_user,
                                    fourG_password, setfourG_password,
                                    fourG_pin, setfourG_pin,
                                    items,setItems,
                                    containerRef,
                                    timeoutId, setTimeoutId,
                                    LOADBANK_I1, setLOADBANK_I1,
                                    LOADBANK_I2, setLOADBANK_I2,
                                    LOADBANK_I3, setLOADBANK_I3,
                                    LOADBANK_V1, setLOADBANK_V1,
                                    LOADBANK_V2, setLOADBANK_V2,
                                    LOADBANK_V3, setLOADBANK_V3,
                                    LOADBANK_P1, setLOADBANK_P1,
                                    LOADBANK_P2, setLOADBANK_P2,
                                    LOADBANK_P3, setLOADBANK_P3,
                                    deviceConnected,
                                    setDeviceConnected,
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
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
