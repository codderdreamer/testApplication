import React, {useRef, createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

interface Item {
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

  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;

  containerRef: React.RefObject<HTMLDivElement>;

  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
  


  // networkjsonString: string | null;
  // setNetworkPriority:(networkjsonString: string | null) => void;
  
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<W3CWebSocket | null>(null);
  const [USBList, setUSBList] = useState<string[]>([]);
  const [wifiSSID, setwifiSSID] = useState<string>("");
  const [wifiPassword, setwifiPassword] = useState<string>("");
  const [fourG_apn, setfourG_apn] = useState<string>("");
  const [fourG_user, setfourG_user] = useState<string>("");
  const [fourG_password, setfourG_password] = useState<string>("");
  const [fourG_pin, setfourG_pin] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // const [networkjsonString, setNetworkPriority] = useState<string | null>(null);
  

  return (
    <MessageContext.Provider value={{socket, setSocket, 
                                    USBList, setUSBList,
                                    wifiSSID, setwifiSSID,
                                    wifiPassword, setwifiPassword,
                                    fourG_apn, setfourG_apn,
                                    fourG_user, setfourG_user,
                                    fourG_password, setfourG_password,
                                    fourG_pin, setfourG_pin,
                                    items,setItems,
                                    containerRef,
                                    timeoutId, setTimeoutId
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
