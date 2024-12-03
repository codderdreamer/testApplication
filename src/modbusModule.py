import serial.tools.list_ports
import time
from threading import Thread
from pymodbus.client import ModbusSerialClient as ModbusClient
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.constants import Endian
from enum import IntEnum,Enum
import json

class IsTestComplete(Enum):
    Testing_The_Device = "0"                        # Cihaz Test Ediliyor
    Testing_Completed_Successfully = "1"            # Test Başarı ile Tamamlandı
    Test_Failed =  "-1"                             # Test Başarısız Oldu
    Test_Not_Started = "DiğerDeğer"                 # Test Başlamadı

class LoadControl(Enum):
    loadbank_0A = "0"
    loadbank_6A = "6"
    loadbank_10A = "10"
    loadbank_closed = "-1"

class RCDControl(Enum):
    Enable_Leakage_Current = "1"
    Disable_Leakage_Current = "0"

class CableControl(Enum):
    Connect_Cable_to_Vehicle = "1"
    Remove_Cable_from_Vehicle = "0"

class ModbusModule():
    def __init__(self, application):
        self.application = application
        self.client = None

        self.IS_TEST_COMPLETED = None
        self.IS_DEVICE_READY = None
        self.IS_SETUP_3PHASE = None
        self.IS_SETUP_SMART_TYPE = None
        self.CP_PWM_DUTY = None
        self.CP_STATE = None
        self.PP_STATE = None
        self.LOAD_CONTROL = None
        self.RCD_CONTROL = None
        self.CABLE_CONTROL = None
        self.LOADBANK_I1 = None
        self.LOADBANK_I2 = None
        self.LOADBANK_I3 = None
        self.LOADBANK_V1 = None
        self.LOADBANK_V2 = None
        self.LOADBANK_V3 = None
        self.LOADBANK_P1 = None
        self.LOADBANK_P2 = None
        self.LOADBANK_P3 = None

        Thread(target=self.scan_modbus_thread,daemon=True).start()
        if self.application.simu_test == False:
            Thread(target=self.read_all_registers,daemon=True).start()


    def connect_modbus(self,port):
        try:
            if self.client != None:
                self.client.close()
            self.client = ModbusClient(port=port, baudrate=115200, timeout=1)
            connect = self.client.connect()
            self.application.modbus_connected = connect
            self.write_cable_control(0)
            if connect == True:
                print("Modbus Bağlandı.")
                # self.read_all_registers()
                return True
            else:
                print("Modbus Bağlanmadı!")
                return False
            
        except Exception as e:
            print("connect_modbus Exception:",e)
            return False
        
    def scan_modbus(self):
        try:
            modbus_ports = []
            ports = serial.tools.list_ports.comports()
            for port in ports:
                # print(f"Port: {port.device}, Description: {port.description}")
                modbus_ports.append(port.device)
            self.application.modbus_ports = modbus_ports
        except Exception as e:
            print("scan_modbus Exception:",e)

    def scan_modbus_thread(self):
        while True:
            try:
                self.scan_modbus()
                time.sleep(5)
            except Exception as e:
                print("scan_modbus_thread Exception:",e)

    def read_all_registers(self):
        while True:
            try:
                start_register = 0
                count = 19
                unit = 1
                response = self.client.read_holding_registers(start_register, count)
                if response.isError():
                    print("Error reading registers")
                else:
                    values = response.registers
                    # print("values:",values)
                    self.IS_TEST_COMPLETED = values[0]
                    self.IS_DEVICE_READY = values[1]
                    self.IS_SETUP_3PHASE = values[2]
                    self.IS_SETUP_SMART_TYPE = values[3]
                    self.CP_PWM_DUTY = values[4]
                    self.CP_STATE = values[5]
                    self.PP_STATE = values[6]
                    self.LOAD_CONTROL = values[7]
                    self.RCD_CONTROL = values[8]
                    self.CABLE_CONTROL = values[9]
                    self.LOADBANK_I1 = values[10]
                    self.LOADBANK_I2 = values[11]
                    self.LOADBANK_I3 = values[12]
                    self.LOADBANK_V1 = values[13]
                    self.LOADBANK_V2 = values[14]
                    self.LOADBANK_V3 = values[15]
                    self.LOADBANK_P1 = values[16]
                    self.LOADBANK_P2 = values[17]
                    self.LOADBANK_P3 = values[18]
            except Exception as e:
                # print("read_all_registers Exception:",e)
                pass

            time.sleep(1)

    def wait_test_device(self):
        while True:
            if self.application.config.cancel_test:
                print("Test iptal edildi!")
                break
            else:
                if self.IS_DEVICE_READY == 1:
                    print("Cihaz hazır.")
                    self.application.frontendWebsocket.websocket.send_message_to_all(json.dumps({
                            "Command": "WaitDeviceResult",
                            "Data": True
                        }))
                    print("Cihaz teste hazır.")
                    break
                else:
                    print("self.IS_DEVICE_READY",self.IS_DEVICE_READY)
            time.sleep(2)

    # Test durumunu belirtir.	
    # 0: Cihaz Test Ediliyor;   1: Test Başarı ile Tamamlandı;   -1: Test Başarısız Oldu;   Diğer Değer: Test Başlamadı
    def write_is_test_complete(self,value:int):
        try:
            if self.application.simu_test == False:
                self.write_register(0,value)
        except Exception as e:
            print("write_is_test_complete Exception:", e)

    # Yük Bankasının kontrolünü sağlar.	
    # 0:YükBankası Devrede  0Amper Yük   ;    6: YükBankası Devrede 6A Yük    ;    10: YükBankası Devrede 10A Yük   ;  -1: YükBankası Kapalı
    def write_load_control(self,value:int):
        try:
            self.write_register(7,value)
        except Exception as e:
            print("write_load_control Exception:", e)

    # Kaçak akımı devreye sokmak için Kullanılır.	
    # 1 : Kaçak Akımı Devreye Sok   ;   0: Kaçak Akım Devrede Değil
    def write_rcd_control(self,value:int):
        try:
            self.write_register(8,value)
        except Exception as e:
            print("write_rcd_control Exception:", e)

    # Araç tarafı kablo kontrolü için kullanılır.	
    # 1 : Kabloyu Araca Tak   ;   0: Kabloyu Araçtan Çıkart
    def write_cable_control(self,value:int):
        try:
            self.write_register(9,value)
        except Exception as e:
            print("write_cable_control Exception:", e)

    def write_register(self, address, value):
        try:
            response = self.client.write_register(address, value)
            if response.isError():
                print(f"Error writing to register {address}")
            else:
                print(f"Successfully wrote {value} to register {address}")
        except Exception as e:
            print("write_register Exception:", e)
        
# modbus = ModbusModule(None)
# time.sleep(5)
# modbus.write_register(9,1)
# while True:
#     time.sleep(10)

        