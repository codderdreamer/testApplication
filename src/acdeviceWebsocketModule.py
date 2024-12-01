
from threading import Thread
import websocket
import time
import json

class AcdeviceWebsocketModule():
    def __init__(self, application) -> None:
        self.application = application
        self.__connection = False
        self.websocket = None
        self.wait_timeout = 60*5 # 5dk
        # if self.application.simu_test == False:
        Thread(target=self.websocket_thread,daemon=True).start()
        self.save_config_result_json_data = None

    @property
    def connection(self):
        return self.__connection

    @connection.setter
    def connection(self, value):
        self.__connection = value

    def on_message(self, ws, message):
        print(f"Incoming message: {message}")
        try:
            sjon = json.loads(message)
            print(f"Incoming: {sjon}")
            Command = sjon["Command"]
            Data = sjon["Data"]
            if Command == "MasterCardResult":
                self.save_config_result_json_data = None
                self.application.config.master_card = None
                self.application.config.user_1_card = None
                self.application.config.user_2_card = None
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if Data == None or Data == "":
                    self.application.modbusModule.write_is_test_complete(-1)
                else:
                    self.application.config.master_card = Data
                    self.application.frontendWebsocket.user_1_card_request()
                    self.application.acdeviceWebsocket.user_1_card_request()
            elif Command == "User1CardResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if Data == None or Data == "":
                    self.application.modbusModule.write_is_test_complete(-1)
                else:
                    self.application.config.user_1_card = Data
                    self.application.frontendWebsocket.user_2_card_request()
                    self.application.acdeviceWebsocket.user_2_card_request()
            elif Command == "User2CardResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if Data == None or Data == "":
                    self.application.modbusModule.write_is_test_complete(-1)
                else:
                    self.application.config.user_2_card = Data
                    self.application.frontendWebsocket.wait_config_result()
                    Thread(target=self.wait_save_config_result,daemon=True).start()
            elif Command == "SaveConfigResult":
                self.save_config_result_json_data = Data
        except Exception as e:
            print("on_message Exception:",e)
        

    def on_error(self, ws, error):
        self.connection = False
        print(f"Hata: {error}")

    def on_close(self, ws, close_status_code, close_msg):
        self.connection = False
        print("Bağlantı kapatıldı")

    def on_open(self, ws):
        self.connection = True
        print("Bağlantı açıldı")

    def websocket_thread(self):
        while True:
            try:
                print("AC Cihazına bağlanma deneniyor...")
                if self.application.simu_test == False:
                    self.websocket = websocket.WebSocketApp(
                        "ws://172.16.0.104:9000",
                        on_message=self.on_message,
                        on_error=self.on_error,
                        on_close=self.on_close,
                    )
                else:
                    self.websocket = websocket.WebSocketApp(
                        "ws://100.103.66.88:9000",
                        on_message=self.on_message,
                        on_error=self.on_error,
                        on_close=self.on_close,
                    )
                self.websocket.on_open = self.on_open
                self.websocket.run_forever()
                print("Websocket kapatıldı.")
                self.connection = False
            except Exception as e:
                print("websocket_thread Exception:",e)
                self.connection = False
            time.sleep(5)

    def wait_save_config_result(self):
        time_start = time.time()
        while True:
            if self.save_config_result_json_data != None:
                self.bluetooth_mac = self.save_config_result_json_data["bluetooth_mac"]
                self.eth_mac = self.save_config_result_json_data["eth_mac"]
                self.mcu_error = self.save_config_result_json_data["mcu_error"]
                self.mcu_connection = self.save_config_result_json_data["mcu_connection"]
                self.imei_4g = self.save_config_result_json_data["imei_4g"]
                self.wlan0_connection = self.save_config_result_json_data["wlan0_connection"]
                break
            if time.time() - time_start > 120:
                self.application.frontendWebsocket.send_ac_charger_not_connected()
                break

    
    def master_card_request(self):
        if self.connection:
            self.websocket.send(json.dumps({
                    "Command": "MasterCardRequest",
                    "Data": ""
                }))
            
    def user_1_card_request(self):
        if self.connection:
            self.websocket.send(json.dumps({
                    "Command": "User1CardRequest",
                    "Data": ""
                }))
            
    def user_2_card_request(self):
        if self.connection:
            self.websocket.send(json.dumps({
                    "Command": "User2CardRequest",
                    "Data": ""
                }))

    def wait_ac_charger_connection(self):
        while True:
            time_start = time.time()
            try:
                if self.application.config.cancel_test:
                    print("Test iptal edildi!")
                    break
                if time.time() - time_start > self.wait_timeout:
                    self.application.frontendWebsocket.send_ac_charger_connect_result(False)
                    self.application.modbusModule.write_is_test_complete(-1)
                    break
                if self.connection:
                    print("Connection var")
                    self.application.frontendWebsocket.send_ac_charger_connect_result(True)
                    self.application.frontendWebsocket.master_card_request()
                    self.master_card_request()
                    break
                if self.application.simu_test:
                    print("self.application.simu_test",self.application.simu_test)
                    self.application.frontendWebsocket.send_ac_charger_connect_result(True)
                    self.application.frontendWebsocket.master_card_request()
                    self.master_card_request()
                    break
            except Exception as e:
                print("wait_ac_charger_connection Exception:",e)
            time.sleep(3)

    def send_save_config(self):
        while True:
            time_start = time.time()
            try:
                if self.application.config.cancel_test:
                    print("Test iptal edildi!")
                    break
                if time.time() - time_start > self.wait_timeout:
                    self.application.modbusModule.write_is_test_complete(-1)
                    print("5dk bounca bağlanamadı Config bilgisi gönderilemedi!")
                    break
                if self.connection:
                    self.websocket.send(json.dumps({
                            "Command": "SaveConfig",
                            "Data": {
                                "wifiSSID" : self.application.config.wifiSSID,
                                "wifiPassword" : self.application.config.wifiPassword,
                                "fourG_apn" : self.application.config.fourG_apn,
                                "fourG_user" : self.application.config.fourG_user,
                                "fourG_password" : self.application.config.fourG_password,
                                "fourG_pin" : self.application.config.fourG_pin,
                                "seriNo" : self.application.config.seriNo,
                                "chargePointId" : self.application.config.chargePointId,
                                "connectorType" : self.application.deviceModel.connectorType.name,
                                "fourg" : self.application.deviceModel.system.name == "RFID_Wifi_Ethernet_Bluetooth_4G",
                                "midMeter" : self.application.deviceModel.midMeter.name
                            }
                        }))
                    break
                if self.application.simu_test:
                    break
            except Exception as e:
                print("send_save_config Exception:",e)
            time.sleep(3)


