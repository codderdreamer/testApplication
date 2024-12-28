import React, { useEffect } from 'react';
import { FiWifi, FiSettings, FiSmartphone } from 'react-icons/fi';
import "./settings.css";

interface SettingsProps {
  wifiSSID: string;
  setWifiSSID: (value: string) => void;
  wifiPassword: string;
  setWifiPassword: (value: string) => void;
  fourG_apn: string;
  setFourG_apn: (value: string) => void;
  fourG_user: string;
  setFourG_user: (value: string) => void;
  fourG_password: string;
  setFourG_password: (value: string) => void;
  fourG_pin: string;
  setFourG_pin: (value: string) => void;
  handleSave: () => void;
  selectedUSB: string;
  setSelectedUSB: (value: string) => void;
  USBList: string[];
  handleUSBChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Settings: React.FC<SettingsProps> = ({
  wifiSSID,
  setWifiSSID,
  wifiPassword,
  setWifiPassword,
  fourG_apn,
  setFourG_apn,
  fourG_user,
  setFourG_user,
  fourG_password,
  setFourG_password,
  fourG_pin,
  setFourG_pin,
  handleSave,
  selectedUSB,
  setSelectedUSB,
  USBList,
  handleUSBChange,
}) => {


  return (
    <div className="settings-container">
      <div className="settings-group">
        <div className="usb-select-container">
          <span>Bağlı USB Kablosu:</span>
          <select value={selectedUSB} onChange={handleUSBChange}>
            {USBList.length > 0 ? (
              USBList.map((usb, index) => (
                <option key={index} value={usb}>
                  {usb}
                </option>
              ))
            ) : (
              <option value="">{selectedUSB || "USB Seçiniz"}</option>
            )}
          </select>
        </div>
        <div className="ip-container">
          <span>Bağlanacak cihazın Ethernet IP'si:</span>
          <span className="ip-value">172.16.0.104</span>
        </div>
      </div>

      <div className="settings-group">
        <h3 className="group-title">
          <FiWifi className="group-icon" />
          WiFi Ayarları
        </h3>
        <div className="input-group">
          <input
            type="text"
            value={wifiSSID}
            onChange={(e) => setWifiSSID(e.target.value)}
            placeholder="WiFi SSID"
          />
          <input
            type="password"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            placeholder="WiFi Şifre"
          />
        </div>
      </div>

      <div className="settings-group">
        <h3 className="group-title">
          <FiSmartphone className="group-icon" />
          4G Ayarları
        </h3>
        <div className="input-group">
          <input
            type="text"
            value={fourG_apn}
            onChange={(e) => setFourG_apn(e.target.value)}
            placeholder="4G APN"
          />
          <input
            type="text"
            value={fourG_user}
            onChange={(e) => setFourG_user(e.target.value)}
            placeholder="4G Kullanıcı Adı"
          />
          <input
            type="password"
            value={fourG_password}
            onChange={(e) => setFourG_password(e.target.value)}
            placeholder="4G Şifre"
          />
          <input
            type="text"
            value={fourG_pin}
            onChange={(e) => setFourG_pin(e.target.value)}
            placeholder="4G PIN"
          />
        </div>
      </div>

      <button className="save-button" onClick={handleSave}>
        Kaydet
      </button>
    </div>
  );
};

export default Settings;