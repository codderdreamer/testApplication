
from threading import Thread
import websocket
import time
import json
from src.enums import *

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
            elif Command == "WaitUser1CardResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if Data:
                    self.application.frontendWebsocket.wait_relay_on()
                    self.application.acdeviceWebsocket.wait_relay_on()
            elif Command == "WaitRelayOnResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if Data:
                    self.application.modbusModule.write_load_control(0)
                    Thread(target=self.control_values,daemon=True).start()

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
                self.application.config.bluetooth_mac = self.save_config_result_json_data["bluetooth_mac"]
                self.application.config.eth_mac = self.save_config_result_json_data["eth_mac"]
                self.application.config.mcu_error = self.save_config_result_json_data["mcu_error"]
                self.application.config.mcu_connection = self.save_config_result_json_data["mcu_connection"]
                self.application.config.imei_4g = self.save_config_result_json_data["imei_4g"]
                self.application.config.wlan0_connection = self.save_config_result_json_data["wlan0_connection"]
                message = {
                    "Command" : "SaveConfigResult",
                    "Data" : self.save_config_result_json_data
                }
                self.application.frontendWebsocket.websocket.send_message_to_all(json.dumps(message))
                if self.is_there_error_in_config(self.save_config_result_json_data):
                    self.application.modbusModule.write_is_test_complete(-1)
                    self.application.frontendWebsocket.again_test()
                else:
                    print("start_charge_test")
                    self.application.frontendWebsocket.start_charge_test()
                    self.application.modbusModule.write_cable_control(1)
                    self.application.frontendWebsocket.wait_user_1_card_request()
                    self.wait_user_1_card_request()
                break
            if time.time() - time_start > 120:
                self.application.frontendWebsocket.send_ac_charger_not_connected()
                break
            time.sleep(3)

    def is_there_error_in_config(self,Data):
        error = False
        if Data["bluetooth_mac"] == "" or Data["bluetooth_mac"] == None:
            error = True
        if Data["eth_mac"] == "" or Data["eth_mac"] == None:
            error = True
        if len(Data["mcu_error"]) > 0:
            error = True
        if Data["mcu_connection"] == False:
            error = True
        if Data["imei_4g"] == "" or Data["imei_4g"] == None:
            error = True
        if Data["wlan0_connection"] == False:
            error = True
        return error
    
    def control_values(self):
        if self.control_voltage():
            self.application.modbusModule.write_load_control(6)
            # time.sleep(2)
            if self.control_current():
                pass

    def control_voltage_current_power(self):
        time_start = time.time()
        while True:
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    pass
                
                if time.time() - time_start > 30:
                    break
            except Exception as e:
                print("control_voltage_current_power Exception:",e)
            
            time.sleep(1)
    
    def control_voltage(self):
        time.sleep(2)
        time_start = time.time()
        self.application.frontendWebsocket.send_control_voltage_request()
        while True:
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_V1 > 195 and self.application.modbusModule.LOADBANK_V1 < 265):
                        self.application.frontendWebsocket.send_control_voltage(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_V2 > 195 and self.application.modbusModule.LOADBANK_V2 < 265):
                        self.application.frontendWebsocket.send_control_voltage(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if not (self.application.modbusModule.LOADBANK_V3 > 195 and self.application.modbusModule.LOADBANK_V3 < 265):
                        self.application.frontendWebsocket.send_control_voltage(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if time.time() - time_start > 5:
                    self.application.frontendWebsocket.send_control_voltage(True)
                    return True
            except Exception as e:
                print("control_voltage Exception:",e)

            time.sleep(1)

    def control_current(self):
        time.sleep(2)
        time_start = time.time()
        self.application.frontendWebsocket.send_control_current_request()
        while True:
            print("-------------------------------------------------------------------------------")
            print("self.application.modbusModule.LOADBANK_V1",self.application.modbusModule.LOADBANK_V1)
            print("self.application.modbusModule.LOADBANK_V2",self.application.modbusModule.LOADBANK_V2)
            print("self.application.modbusModule.LOADBANK_V3",self.application.modbusModule.LOADBANK_V3)
            print("self.application.modbusModule.LOADBANK_I1",self.application.modbusModule.LOADBANK_I1)
            print("self.application.modbusModule.LOADBANK_I2",self.application.modbusModule.LOADBANK_I2)
            print("self.application.modbusModule.LOADBANK_I3",self.application.modbusModule.LOADBANK_I3)
            print("self.application.modbusModule.LOADBANK_P1",self.application.modbusModule.LOADBANK_P1)
            print("self.application.modbusModule.LOADBANK_P2",self.application.modbusModule.LOADBANK_P2)
            print("self.application.modbusModule.LOADBANK_P3",self.application.modbusModule.LOADBANK_P3)
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_I1 > 4.5 and self.application.modbusModule.LOADBANK_I1 < 6.5):
                        self.application.frontendWebsocket.send_control_current(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_I2 > 4.5 and self.application.modbusModule.LOADBANK_I2 < 6.5):
                        self.application.frontendWebsocket.send_control_current(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if not (self.application.modbusModule.LOADBANK_I3 > 4.5 and self.application.modbusModule.LOADBANK_I3 < 6.5):
                        self.application.frontendWebsocket.send_control_current(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if time.time() - time_start > 5:
                    self.application.frontendWebsocket.send_control_current(True)
                    return True
            except Exception as e:
                print("control_current Exception:",e)

            time.sleep(1)

    def wait_relay_on(self):
        try:
            if self.connection:
                self.websocket.send(json.dumps({
                        "Command": "WaitRelayOnRequest",
                        "Data": ""
                    }))
        except Exception as e:
            print("wait_relay_on Exception:",e)

    def wait_user_1_card_request(self):
        try:
            if self.connection:
                self.websocket.send(json.dumps({
                        "Command": "WaitUser1CardRequest",
                        "Data": ""
                    }))
        except Exception as e:
            print("wait_user_1_card_request Exception:",e)

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


