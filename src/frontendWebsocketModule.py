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

    def rcd_leakage_current_set(self):
        try:
            message = {
                "Command": "RCDLeakageCurrentSet",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("rcd_leakage_current_test Exception",e)

    def rcd_leakage_current_test(self):
        try:
            message = {
                "Command": "RCDLeakageCurrentTest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("rcd_leakage_current_test Exception",e)

    def wait_c_state_result(self,value):
        try:
            message = {
                "Command": "WaitCStateResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_c_state Exception",e)

    def wait_c_state(self):
        try:
            message = {
                "Command": "WaitCState",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_c_state Exception",e)

    def send_over_current_test(self):
        try:
            message = {
                "Command": "OverCurrentTest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("over_current_test Exception",e)

    def send_control_all_values_30sn(self):
        try:
            message = {
                "Command": "ControlAllValues30sn",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_all_values_30sn Exception",e)

    def send_control_all_values_30sn_result(self,value):
        try:
            message = {
                "Command": "ControlAllValues30snResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_all_values_30sn Exception",e)

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

    def send_seri_no_request(self):
        try:
            message = {
                "Command": "SeriNoRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_seri_no_request Exception",e)

    def send_control_voltage_current_power(self,value):
        try:
            message = {
                "Command": "ControlVoltageCurrentPower",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_voltage_current_power Exception",e)

    def wait_state_a(self):
        try:
            message = {
                "Command": "WaitAState",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_state_a Exception",e)

    def wait_state_a_result(self,value):
        try:
            message = {
                "Command": "WaitAStateResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_state_a Exception",e)

    def second_user_wait_c_state_result(self,value):
        try:
            message = {
                "Command": "SecondUserWaitCStateResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("second_user_wait_c_state_result Exception",e)

    def end_test(self):
        try:
            message = {
                "Command": "EndTest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("end_test Exception",e)

    def send_sap_result(self,value):
        try:
            message = {
                "Command": "SapResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_sap_result Exception",e)

    def second_user_card_test(self):
        try:
            message = {
                "Command": "SecondUserCard",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_state_a Exception",e)

    def send_control_voltage_charge_test_request(self):
        try:
            message = {
                "Command": "ControlVoltageChargeTestRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_voltage_charge_test_request Exception",e)

    def send_control_voltage_request(self):
        try:
            message = {
                "Command": "ControlVoltageRCDRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_voltage_request Exception",e)

    def send_control_current_request(self):
        try:
            message = {
                "Command": "ControlCurrentRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_control_current_request Exception",e)

    def send_control_voltage_charge_test_result(self,value):
        try:
            message = {
                "Command": "ControlVoltageChargeTestResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_config_result Exception",e)

    def send_control_voltage(self,value):
        try:
            message = {
                "Command": "ControlVoltageRCDResult",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_config_result Exception",e)

    def send_control_current(self,value):
        try:
            message = {
                "Command": "ControlCurrent",
                "Data": value
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_config_result Exception",e)

    def wait_config_result(self):
        try:
            message = {
                "Command": "WaitConfigResult",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_config_result Exception",e)

    def user_1_card_request(self):
        try:
            message = {
                "Command": "User1CardRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("user_1_card_request Exception",e)

    def user_2_card_request(self):
        try:
            message = {
                "Command": "User2CardRequest",
                "Data": ""
            }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
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
            print("frontend send:",message)
        except Exception as e:
            print("send_ac_charger_not_connected Exception",e)

    def send_device_B(self,value):
        try:
            message = {
                    "Command": "DeviceB",
                    "Data": value
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("send_device_B Exception",e)

    def start_charge_test(self):
        try:
            message = {
                    "Command": "ChargeTest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("start_charge_test Exception",e)

    def again_test(self):
        try:
            message = {
                    "Command": "AgainTest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("again_test Exception",e)

    def wait_user_1_card_request(self):
        try:
            message = {
                    "Command": "WaitUser1CardRequest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_user_1_card_request Exception",e)

    def wait_user_2_card_request(self):
        try:
            message = {
                    "Command": "WaitUser2CardRequest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
        except Exception as e:
            print("wait_user_2_card_request Exception",e)

    def wait_relay_on(self):
        try:
            message = {
                    "Command": "WaitRelayOnRequest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
            print("frontend send:",message)
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
                        "selectedUSB" : self.application.config.selectedUSB,
                    }
                }
                print(message)
                self.websocket.send_message_to_all(json.dumps(message))
                self.send_product_info()
                self.test_send_seri_no_logs()
            except Exception as e:
                print(f"could not get New Client id: {e}")
                sys.stdout.flush()


    def test_send_seri_no_logs(self):
        try:
            # Database'den sadece benzersiz seri numaralarını al
            seri_numbers = self.application.config.get_unique_serial_numbers()
            
            message = {
                "Command": "SeriNoLogs",
                "Data": seri_numbers
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("test_send_seri_no_logs Exception", e)

    def send_test_times(self, seri_no):
        try:
            # Seçili seri numarasına ait test zamanlarını al
            test_logs = self.application.config.get_test_logs(seri_no)
            test_times = [log['test_date'].strftime("%Y-%m-%d %H:%M:%S") for log in test_logs]
            
            message = {
                "Command": "TestTimes",
                "Data": test_times
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print(f"send_test_times Exception: {e}")

    def test_send_seri_no_logs_result(self, data):
        try:
            if isinstance(data, dict):
                # Tarih seçildiğinde
                selected_seri_no = data["seriNo"]
                selected_time = data["testTime"]
                
                # Sadece seçili zamana ait test sonucunu al
                test_logs = self.application.config.get_test_logs(selected_seri_no)
                filtered_logs = [log for log in test_logs 
                               if log['test_date'].strftime("%Y-%m-%d %H:%M:%S") == selected_time]
            else:
                # Sadece seri no seçildiğinde
                selected_seri_no = data
                # Test zamanlarını gönder
                self.send_test_times(selected_seri_no)
                return

            message = {
                "Command": "SeriNoLogsResult",
                "Data": [{
                    "testNo": str(log['id']),
                    "seriNo": log['seri_no'],
                    "testTime": log['test_date'].strftime("%Y-%m-%d %H:%M:%S"),
                    "testSteps": log['testSteps']
                } for log in filtered_logs]
            }
            print(message)
            self.websocket.send_message_to_all(json.dumps(message))

        except Exception as e:
            print(f"test_send_seri_no_logs_result Exception: {e}")

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
                if Command == "Save":
                    self.save_config(Data)
                elif Command == "StartTest":
                    self.application.config.cancel_test = False
                    self.application.acdeviceWebsocket.save_config_result_json_data = None
                    if self.application.simu_test == False:
                        usb_connected = self.application.modbusModule.connect_modbus()
                        print("usb_connected",usb_connected)
                    else:
                        usb_connected = True
                    self.send_frontend_connect_usb(usb_connected)
                    if usb_connected:
                        self.application.modbusModule.write_is_test_complete(0)
                        self.send_seri_no_request()
                elif Command == "SeriNoBarcode":
                    self.application.config.seriNo = Data
                    test_step = {
                        1: {
                            "description": f"Cihaz Seri No: {Data}",
                            "value": True
                        }
                    }
                    self.application.config.save_test_log(self.application.config.seriNo, test_step)
                    if self.application.simu_test == False:
                        result = self.application.sap.get_serialNumberDetails(self.application.config.seriNo)
                    else:
                        result = True
                    self.send_frontend_sap_seri_no_knowledge(result)
                    self.send_frontend_charge_point_id_request(result)
                    if result == False:
                        self.application.modbusModule.write_is_test_complete(-1)
                    else:
                        test_step = {
                            2: {
                                "description": f"SAP Seri No Bilgileri",
                                "value": True,
                                "sub_steps": {
                                    1: {
                                        "description": f"ItemCode: {self.application.deviceModel.ItemCode}",
                                        "value": True
                                    },
                                    2: {
                                        "description": f"Emergency Button: {self.application.deviceModel.emergencyButton}",
                                        "value": True
                                    },
                                    3: {
                                        "description": f"MID Meter: {self.application.deviceModel.midMeter}",
                                        "value": True
                                    },
                                    4: {
                                        "description": f"System: {self.application.deviceModel.system}",
                                        "value": True
                                    },
                                    5: {
                                        "description": f"Body Color: {self.application.deviceModel.bodyColor}",
                                        "value": True
                                    },
                                    6: {
                                        "description": f"Connector Type: {self.application.deviceModel.connectorType}",
                                        "value": True
                                    },
                                    7: {
                                        "description": f"Case Type: {self.application.deviceModel.caseType}",
                                        "value": True
                                    }
                                }
                            }
                        }
                        self.application.config.save_test_log(self.application.config.seriNo, test_step)
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
                    self.application.acdeviceWebsocket.cancel_test()
                    self.application.modbusModule.write_cable_control(0)
                    self.application.modbusModule.write_load_control(0)
                    self.application.config.cancel_test = True
                elif Command == "SelectedSeriNoLog":
                    if isinstance(Data, dict):
                        # Tarih seçildiğinde
                        self.test_send_seri_no_logs_result(Data)
                    else:
                        # Sadece seri no seçildiğinde
                        selected_seri_no = Data
                        self.test_send_seri_no_logs_result(selected_seri_no)
        except Exception as e:
            print("MessageReceivedws Exception",e)

    def send_bluetooth_key_result(self):
        try:
            message = {
                    "Command": "BluetoothKeyResult",
                    "Data": {
                        "bluetooth_key" : self.application.config.bluetooth_key,
                        "bluetooth_iv_key" : self.application.config.bluetooth_iv_key,
                        "bluetooth_password" : self.application.config.bluetooth_password
                    }
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_bluetooth_key_result Exception:",e)

    def send_bluetooth_key_request(self):
        try:
            message = {
                    "Command": "BluetoothKeyRequest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_bluetooth_key_request Exception:",e)

    def send_mcu_firmware_update(self):
        try:
            message = {
                    "Command": "MCUFirmwareUpdateRequest",
                    "Data": ""
                }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_mcu_firmware_update_result Exception:",e)

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
            
            self.application.config.write_config()
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
            if self.application.simu_test:
                self.application.deviceModel.find("HC022304212")
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
                self.send_seri_no_request()
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

    def send_product_info(self):
        """Product info tablosundaki verileri getir ve websocket üzerinden gönder"""
        try:
            product_info_list = self.application.config.get_product_info()

            self.websocket.send_message_to_all(json.dumps({
                "Command": "ProductInfoList",
                "Data": product_info_list
                }))

        except Exception as e:
            print(f"Product info gönderme hatası: {e}")

    def send_test_results(self, seriNo, testTime):
        try:
            # Burada veritabanından veya başka bir kaynaktan test sonuçlarını alabilirsiniz
            message = {
                "Command": "SeriNoLogsResult",
                "Data": [{
                    "testNo": "1",
                    "seriNo": seriNo,
                    "testTime": testTime,
                    "testSteps": {
                        # ... test adımları
                    }
                }]
            }
            self.websocket.send_message_to_all(json.dumps(message))
        except Exception as e:
            print("send_test_results Exception:", e)