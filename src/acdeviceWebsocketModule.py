
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
        self.current_L1 = None
        self.current_L2 = None
        self.current_L3 = None
        self.voltage_L1 = None
        self.voltage_L2 = None
        self.voltage_L3 = None
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
            elif Command == "ControlAllValues30snResult":
                self.current_L1 = Data["current_L1"]
                self.current_L2 = Data["current_L2"]
                self.current_L3 = Data["current_L3"]
                self.voltage_L1 = Data["voltage_L1"]
                self.voltage_L2 = Data["voltage_L2"]
                self.voltage_L3 = Data["voltage_L3"]
            elif Command == "OverCurrentTestResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if len(Data) > 0:
                    self.application.modbusModule.write_load_control(0)
                    self.application.frontendWebsocket.wait_c_state()
                    time.sleep(10)
                    Thread(target=self.wait_c_state,daemon=True).start()
                else:
                    self.application.modbusModule.write_load_control(0)
                    self.application.modbusModule.write_cable_control(0)
                    self.application.modbusModule.write_is_test_complete(-1)
            elif Command == "RCDLeakageCurrentTestResult":
                self.application.frontendWebsocket.websocket.send_message_to_all(message)
                if len(Data) > 0:
                    self.application.modbusModule.write_cable_control(0)
                    Thread(target=self.wait_state_a,daemon=True).start()
                else:
                    self.application.modbusModule.write_load_control(0)
                    self.application.modbusModule.write_cable_control(0)
                    self.application.modbusModule.write_is_test_complete(-1)


        except Exception as e:
            print("on_message Exception:",e)

    def wait_state_a(self):
        time_start = time.time()
        self.application.frontendWebsocket.wait_state_a()
        while True:
            print("CP_STATE:",self.application.modbusModule.CP_STATE)
            if self.application.config.cancel_test:
                print("Test iptal edildi!")
                break
            if time.time() - time_start > 5:
                print("5 snyeyi geçti")
                self.application.frontendWebsocket.wait_state_a_result(False)
                self.application.modbusModule.write_load_control(0)
                self.application.modbusModule.write_cable_control(0)
                self.application.modbusModule.write_is_test_complete(-1)
                break
            if self.application.modbusModule.CP_STATE == 0:
                self.application.frontendWebsocket.wait_state_a_result(True)
                self.application.modbusModule.write_cable_control(1)
                self.application.frontendWebsocket.second_user_card_test()
                Thread(target=self.second_user_wait_c_state,daemon=True).start()
                break
            time.sleep(1)

    def second_user_wait_c_state(self):
        time_start = time.time()
        while True:
            if self.application.config.cancel_test:
                print("Test iptal edildi!")
                break
            if time.time() - time_start > 10:
                self.application.frontendWebsocket.second_user_wait_c_state_result(False)
                self.application.modbusModule.write_load_control(0)
                self.application.modbusModule.write_cable_control(0)
                self.application.modbusModule.write_is_test_complete(-1)
                break
            if self.application.modbusModule.CP_STATE == 2:
                self.application.frontendWebsocket.second_user_wait_c_state_result(False)
                self.application.modbusModule.write_cable_control(0)
                self.application.modbusModule.write_load_control(0)
                self.application.modbusModule.write_is_test_complete(1)
                self.application.frontendWebsocket.end_test()
                result = self.application.sap.update_serialNumberDetails()
                self.application.frontendWebsocket.send_sap_result(result)
                break


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
    
    def wait_c_state(self):
        time_start = time.time()
        while True:
            print("CP_STATE",self.application.modbusModule.CP_STATE)
            if self.application.modbusModule.CP_STATE == 2:
                self.application.frontendWebsocket.wait_c_state_result(True)
                self.application.frontendWebsocket.rcd_leakage_current_test()
                if self.control_voltage():
                    self.application.modbusModule.write_rcd_control(1)
                    self.application.frontendWebsocket.rcd_leakage_current_set()
                    self.rcd_leakage_current_test()
                break
            if time.time() - time_start > 40:
                self.application.frontendWebsocket.wait_c_state_result(False)
                break
            time.sleep(1)

    def rcd_leakage_current_test(self):
        try:
            if self.connection:
                self.websocket.send(json.dumps({
                        "Command": "RCDLeakageCurrentTest",
                        "Data": ""
                    }))
        except Exception as e:
            print("rcd_leakage_current_test Exception:",e)

    def send_over_current_test(self):
        try:
            if self.connection:
                self.websocket.send(json.dumps({
                        "Command": "OverCurrentTest",
                        "Data": ""
                    }))
        except Exception as e:
            print("send_over_current_test Exception:",e)

    def control_values(self):
        if self.control_voltage():
            self.application.modbusModule.write_load_control(6)
            if self.control_current():
                if self.control_all_values_30sn():
                    self.over_current_test()

    def over_current_test(self):
        self.application.frontendWebsocket.send_over_current_test()
        self.application.acdeviceWebsocket.send_over_current_test()
        self.application.modbusModule.write_load_control(10)
    
    def control_voltage(self):
        time.sleep(4)
        time_start = time.time()
        self.application.frontendWebsocket.send_control_voltage_request()
        while True:
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_V1 > 195 and self.application.modbusModule.LOADBANK_V1 < 265):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_V1",self.application.modbusModule.LOADBANK_V1)
                        self.application.frontendWebsocket.send_control_voltage(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_V2 > 195 and self.application.modbusModule.LOADBANK_V2 < 265):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_V2",self.application.modbusModule.LOADBANK_V2)
                        self.application.frontendWebsocket.send_control_voltage(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if not (self.application.modbusModule.LOADBANK_V3 > 195 and self.application.modbusModule.LOADBANK_V3 < 265):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_V3",self.application.modbusModule.LOADBANK_V3)
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
        time.sleep(4)
        time_start = time.time()
        self.application.frontendWebsocket.send_control_current_request()
        while True:
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_I1 > 4500 and self.application.modbusModule.LOADBANK_I1 < 6500):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_I1",self.application.modbusModule.LOADBANK_I1)
                        self.application.frontendWebsocket.send_control_current(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if not (self.application.modbusModule.LOADBANK_I2 > 4500 and self.application.modbusModule.LOADBANK_I2 < 6500):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_I2",self.application.modbusModule.LOADBANK_I2)
                        self.application.frontendWebsocket.send_control_current(False)
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if not (self.application.modbusModule.LOADBANK_I3 > 4500 and self.application.modbusModule.LOADBANK_I3 < 6500):
                        print("Sınırı aştı: self.application.modbusModule.LOADBANK_I3",self.application.modbusModule.LOADBANK_I3)
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

    def control_all_values_30sn(self):
        self.application.frontendWebsocket.send_control_all_values_30sn()
        self.application.acdeviceWebsocket.send_control_all_values_30sn()
        time.sleep(2)
        time_start = time.time()
        while True:
            try:
                if self.application.deviceModel.outputPower == OutputPower.Max32A_7kW or self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if abs(self.application.modbusModule.LOADBANK_V1 - self.voltage_L1) > self.voltage_L1 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_V1:",self.application.modbusModule.LOADBANK_V1,"cihaz voltage_L1:",self.voltage_L1)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if abs(self.application.modbusModule.LOADBANK_I1/1000 - self.current_L1) > self.current_L1 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_I1:",self.application.modbusModule.LOADBANK_I1/1000,"cihaz current_L1:",self.current_L1)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if self.application.deviceModel.outputPower == OutputPower.Max32A_22kW:
                    if abs(self.application.modbusModule.LOADBANK_V2 - self.voltage_L2) > self.voltage_L2 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_V2:",self.application.modbusModule.LOADBANK_V2,"cihaz voltage_L2:",self.voltage_L2)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if abs(self.application.modbusModule.LOADBANK_I2/1000 - self.current_L2) > self.current_L2 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_I2:",self.application.modbusModule.LOADBANK_I2/1000,"cihaz current_L2:",self.current_L2)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if abs(self.application.modbusModule.LOADBANK_V3 - self.voltage_L3) > self.voltage_L3 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_V3:",self.application.modbusModule.LOADBANK_V3,"cihaz voltage_L3:",self.voltage_L3)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                    if abs(self.application.modbusModule.LOADBANK_I3/1000 - self.current_L3) > self.current_L3 * 0.05:
                        print("%5 sınırını aştı: LOADBANK_I3:",self.application.modbusModule.LOADBANK_I3/1000,"cihaz current_L3:",self.current_L3)
                        self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                        self.application.acdeviceWebsocket.cancel_test()
                        self.application.modbusModule.write_cable_control(0)
                        self.application.modbusModule.write_is_test_complete(-1)
                        return False
                if abs(self.application.modbusModule.CP_PWM_DUTY/1000 - 6 ) > 6 * 0.05:
                    print("%5 sınırını aştı: CP_PWM_DUTY:",self.application.modbusModule.CP_PWM_DUTY/1000,"cihaz CP_PWM_DUTY:",6)
                    self.application.frontendWebsocket.send_control_all_values_30sn_result(False)
                    self.application.acdeviceWebsocket.cancel_test()
                    self.application.modbusModule.write_cable_control(0)
                    self.application.modbusModule.write_is_test_complete(-1)
                    return False
                if time.time() - time_start > 30:
                    self.application.frontendWebsocket.send_control_all_values_30sn_result(True)
                    return True
            except Exception as e:
                print("control_all_values_30sn Exception:",e)

            time.sleep(1)

        
    def send_control_all_values_30sn(self):
        try:
            if self.connection:
                self.websocket.send(json.dumps({
                        "Command": "ControlAllValues30sn",
                        "Data": ""
                    }))
        except Exception as e:
            print("send_control_all_values_30sn Exception:",e)

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

    def cancel_test(self):
        if self.connection:
            self.websocket.send(json.dumps({
                    "Command": "CancelTest",
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


