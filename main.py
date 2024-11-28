
import time
from src.flaskServer import *
from src.modbusModule import *
from src.findEthernet import *
from src.sap import *
from src.deviceModel import *
from src.frontendWebsocketModule import *
from src.acdeviceWebsocketModule import *
from src.configModule import *

class Application():
    def __init__(self):
        self.modbus_ports = []                  # Aktif portlar
        self.aktive_eth = []                    # Aktif ethernetler
        self.modbus_connected = False           # Modbus bağlantısı

        self.config = Config()
        self.serialNo = None
        self.deviceModel = DeviceModel(self)
        self.flaskServer = FlaskServer(self)
        self.modbusModule = ModbusModule(self)
        self.findEthernet = FindEthernet(self)
        self.frontendWebsocket = FrontendWebsocketModule(self)
        self.acdeviceWebsocket = AcdeviceWebsocketModule(self)
        self.sap = SAP(self)

    def run(self):
        pass

    

if __name__ == "__main__":
    try:
        Application().run()
        print("...Application started...")
    except Exception as e:
        print("__main__ Exception:", e)
          
    while True:
        time.sleep(5)
