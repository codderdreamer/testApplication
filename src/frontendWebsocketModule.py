
import websocket_server
from threading import Thread
import json
import sys
import time

class FrontendWebsocketModule():
    def __init__(self, application) -> None:
        self.application = application
        self.websocket = websocket_server.WebsocketServer('0.0.0.0', 4000)
        self.websocket.set_fn_new_client(self.NewClientws)
        self.websocket.set_fn_client_left(self.ClientLeftws)
        self.websocket.set_fn_message_received(self.MessageReceivedws)
        Thread(target=self.websocket.run_forever, daemon=True).start()
        Thread(target=self.send_connected_USB_list,daemon=True).start()
        Thread(target=self.send_all_load_data,daemon=True).start()

    def send_all_load_data(self):
        while True:
            try:
                message = {
                    "Command": "LoadData",
                    "Data": {
                        "LOADBANK_I1" : self.application.modbusModule.LOADBANK_I1,
                        "LOADBANK_I2" : self.application.modbusModule.LOADBANK_I2,
                        "LOADBANK_I3" : self.application.modbusModule.LOADBANK_I3,
                        "LOADBANK_V1" : self.application.modbusModule.LOADBANK_V1,
                        "LOADBANK_V2" : self.application.modbusModule.LOADBANK_V2,
                        "LOADBANK_V3" : self.application.modbusModule.LOADBANK_V3,
                        "LOADBANK_P1" : self.application.modbusModule.LOADBANK_P1,
                        "LOADBANK_P2" : self.application.modbusModule.LOADBANK_P2,
                        "LOADBANK_P3" : self.application.modbusModule.LOADBANK_P3
                    }
                }
                self.websocket.send_message_to_all(json.dumps(message))
            except Exception as e:
                # print("send_all_load_data Exception",e)
                pass
            time.sleep(1)

    def send_control_voltage(self,value):
        try:
            message = {
                "Command": "ControlVoltage",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("wait_config_result Exception",e)

    def send_control_current(self,value):
        try:
            message = {
                "Command": "ControlCurrent",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("wait_config_result Exception",e)

    def wait_config_result(self):
        try:
            message = {
                "Command": "WaitConfigResult",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("wait_config_result Exception",e)

    def user_1_card_request(self):
        try:
            message = {
                "Command": "User1CardRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("user_1_card_request Exception",e)

    def user_2_card_request(self):
        try:
            message = {
                "Command": "User2CardRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("user_2_card_request Exception",e)
        
    def send_connected_USB_list(self):
        while True:
            try:
                message = {
                    "Command": "USBList",
                    "Data": self.application.modbus_ports
                }
                self.websocket.send_message_to_all(json.dumps(message))
            except Exception as e:
                print("send_connected_USB_list Exception",e)

            time.sleep(3)

    def send_connected_eth_list(self):
        while True:
            try:
                message = {
                    "Command": "ETHList",
                    "Data": self.application.aktive_eth
                }
                self.websocket.send_message_to_all(json.dumps(message))
            except Exception as e:
                print("send_connected_USB_list Exception",e)

            time.sleep(3)

    def send_ac_charger_not_connected(self):
        try:
            message = {
                    "Command": "ACChargerNotConnected",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_ac_charger_not_connected Exception",e)

    def start_charge_test(self):
        try:
            message = {
                    "Command": "ChargeTest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("start_charge_test Exception",e)

    def again_test(self):
        try:
            message = {
                    "Command": "AgainTest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("again_test Exception",e)

    def wait_user_1_card_request(self):
        try:
            message = {
                    "Command": "WaitUser1CardRequest",
                    "Data": ""
                }
        except Exception as e:
            print("wait_user_1_card_request Exception",e)

    def wait_relay_on(self):
        try:
            message = {
                    "Command": "WaitRelayOnRequest",
                    "Data": ""
                }
        except Exception as e:
            print("wait_relay_on Exception",e)


    def NewClientws(self, client, server):
        self.client = client
        if client:
            try:
                print(f"New client connected and was given id {client['id']} {client['address']}")
                sys.stdout.flush()
                message = {
                    "Command": "Config",
                    "Data": {
                        "wifiSSID" : self.application.config.wifiSSID,
                        "wifiPassword" : self.application.config.wifiPassword,
                        "fourG_apn" : self.application.config.fourG_apn,
                        "fourG_user" : self.application.config.fourG_user,
                        "fourG_password" : self.application.config.fourG_password,
                        "fourG_pin" : self.application.config.fourG_pin,
                    }
                }
                print(message)
                self.websocket.send_message_to_all(json.dumps(message))
            except Exception as e:
                print(f"could not get New Client id: {e}")
                sys.stdout.flush()

    def ClientLeftws(self, client, server):
        try:
            self.client = client
            if client:
                client['handler'].keep_alive = 0
                client['handler'].valid_client = False
                client['handler'].connection._closed = True
                print(f"Client disconnected client[id]:{client['id']} client['address']={client['address']}")
        except Exception as e:
            print(f"c['handler'] client remove problem: {e}")

    def MessageReceivedws(self, client, server, message):
        try:
            self.client = client
            if client['id']:
                sjon = json.loads(message)
                print(f"Incoming: {sjon}")
                Command = sjon["Command"]
                Data = sjon["Data"]
                if Command == "StartTest":
                    self.save_config(Data)
                    if self.application.simu_test == False:
                        usb_connected = self.application.modbusModule.connect_modbus(self.application.config.selectedUSB)
                        print("usb_connected",usb_connected)
                    else:
                        usb_connected = True
                    self.send_frontend_connect_usb(usb_connected)
                    if usb_connected:
                        self.application.modbusModule.write_is_test_complete(0)
                elif Command == "SeriNoBarcode":
                    self.application.config.seriNo = Data
                    if self.application.simu_test == False:
                        result = self.application.sap.get_serialNumberDetails(self.application.config.seriNo)
                    else:
                        result = True
                    self.send_frontend_sap_seri_no_knowledge(result)
                    self.send_frontend_charge_point_id_request(result)
                    if result == False:
                        self.application.modbusModule.write_is_test_complete(-1)
                elif Command == "ChargePointIdBarcode":
                    self.application.config.chargePointId = Data
                    self.send_frontend_wait_device()
                    Thread(target=self.application.modbusModule.wait_test_device,daemon=True).start()
                    if self.application.simu_test:
                        self.application.modbusModule.IS_DEVICE_READY = 1
                elif Command == "ACChargerConnectRequest":
                    Thread(target=self.application.acdeviceWebsocket.wait_ac_charger_connection,daemon=True).start()
                    Thread(target=self.application.acdeviceWebsocket.send_save_config,daemon=True).start()
                elif Command == "CancelTest":
                    self.application.modbusModule.write_cable_control(0)
                    self.application.config.cancel_test = True
        except Exception as e:
            print("MessageReceivedws Exception",e)

    def send_ac_charger_connect_result(self,result):
        try:
            self.websocket.send_message_to_all(json.dumps({
                            "Command": "ACChargerConnectResult",
                            "Data": result
                        }))
        except Exception as e:
            print("send_ac_charger_connect_result Exception:",e)

    def master_card_request(self):
        try:
            self.websocket.send_message_to_all(json.dumps({
                            "Command": "MasterCardRequest",
                            "Data": ""
                        }))
        except Exception as e:
            print("master_card_request Exception:",e)


    def save_config(self,Data):
        try:
            self.application.config.cancel_test = False
            self.application.config.wifiSSID = Data["wifiSSID"]
            self.application.config.wifiPassword = Data["wifiPassword"]
            self.application.config.fourG_apn = Data["fourG_apn"]
            self.application.config.fourG_user = Data["fourG_user"]
            self.application.config.fourG_password = Data["fourG_password"]
            self.application.config.fourG_pin = Data["fourG_pin"]

            self.application.config.selectedUSB = Data["selectedUSB"]
            self.application.config.sap_save_device = Data["sap"]
            
            self.application.config.write_config_json()
            print("Bilgiler kayıt edildi.")
        except Exception as e:
            print("save_config Exception:",e)

    def send_frontend_connect_usb(self,usb_connected):
        try:
            self.websocket.send_message_to_all(json.dumps({
                    "Command": "USBControl",
                    "Data": usb_connected
                }))
        except Exception as e:
            print("send_frontend_connect_usb Exception:",e)

    def send_frontend_sap_seri_no_knowledge(self,result):
        try:
            if self.application.simu_test == False:
                if result:
                    self.websocket.send_message_to_all(json.dumps({
                            "Command": "SeriNoBarcodeResult",
                            "Data": {
                                "result" : result,
                                "ItemCode" : self.application.deviceModel.ItemCode,
                                "emergencyButton" : self.application.deviceModel.emergencyButton.name,
                                "midMeter" : self.application.deviceModel.midMeter.name,
                                "system" : self.application.deviceModel.system.name,
                                "bodyColor" : self.application.deviceModel.bodyColor.name,
                                "connectorType" : self.application.deviceModel.connectorType.name,
                                "caseType" : self.application.deviceModel.caseType.name,
                            }
                        }))
                else:
                    self.websocket.send_message_to_all(json.dumps({
                            "Command": "SeriNoBarcodeResult",
                            "Data": {
                                "result" : result
                            }
                        }))
            else:
                self.application.deviceModel.find("HC022304312")
                self.websocket.send_message_to_all(json.dumps({
                            "Command": "SeriNoBarcodeResult",
                            "Data": {
                                "result" : True,
                                "ItemCode" : self.application.deviceModel.ItemCode,
                                "emergencyButton" : self.application.deviceModel.emergencyButton.name,
                                "midMeter" : self.application.deviceModel.midMeter.name,
                                "system" : self.application.deviceModel.system.name,
                                "bodyColor" : self.application.deviceModel.bodyColor.name,
                                "connectorType" : self.application.deviceModel.connectorType.name,
                                "caseType" : self.application.deviceModel.caseType.name,
                            }
                        }))
        except Exception as e:
            print("send_frontend_sap_knowledge Exception:",e)

    def send_frontend_charge_point_id_request(self,result):
        try:
            if result:
                self.websocket.send_message_to_all(json.dumps({
                    "Command": "ChargePointIdRequest",
                    "Data": ""
                }))
        except Exception as e:
            print("send_frontend_charge_point_id_request Exception:",e)

    def send_frontend_wait_device(self):
        try:
            self.websocket.send_message_to_all(json.dumps({
                    "Command": "WaitDevice",
                    "Data": ""
                }))
        except Exception as e:
            print("send_frontend_wait_device Exception:",e)