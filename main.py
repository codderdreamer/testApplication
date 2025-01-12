import time
from src.flaskServer import *
from src.modbusModule import *
from src.findEthernet import *
from src.sap import *
from src.deviceModel import *
from src.frontendWebsocketModule import *
from src.acdeviceWebsocketModule import *
from src.configModule import *
import secrets
import string

class Application():
    def __init__(self):
        self.simu_test = True
        self.modbus_ports = []                  # Aktif portlar
        self.aktive_eth = []                    # Aktif ethernetler
        self.modbus_connected = False           # Modbus bağlantısı

        self.config = Config()
        self.deviceModel = DeviceModel(self)
        self.flaskServer = FlaskServer(self)
        self.modbusModule = ModbusModule(self)
        self.findEthernet = FindEthernet(self)
        self.frontendWebsocket = FrontendWebsocketModule(self)
        self.acdeviceWebsocket = AcdeviceWebsocketModule(self)
        self.sap = SAP(self)

    def run(self):
        pass

    def create_bluetooth_key(self):
        # Generate and verify bluetooth key
        while True:
            self.config.bluetooth_key = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
            if not self.sap.check_bluetooth_key_exists(self.config.bluetooth_key):
                break

        # Generate and verify bluetooth IV key
        while True:
            self.config.bluetooth_iv_key = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
            if not self.sap.check_bluetooth_iv_exists(self.config.bluetooth_iv_key):
                break

        # Generate and verify bluetooth password
        while True:
            self.config.bluetooth_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            if not self.sap.check_bluetooth_password_exists(self.config.bluetooth_password):
                break

if __name__ == "__main__":
    try:
        Application().run()
        print("...Application started...")
    except Exception as e:
        print("__main__ Exception:", e)
          
    while True:
        time.sleep(5)
