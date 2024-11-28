
# "ItemCode": "HC021103222",
#   Case Type	        Connector Type	            Output Power	        Body Color	        System	                        MID Meter	    Emergency Button
#   Case B	            Type2 Socket	            Max. 32A - 7.4kW	    Red	                RFID,Wifi,Ethernet,Bluetooth	No	            No				
#     0-3	                4	                        5	                6-7	                8	                            9	            10

from enum import IntEnum,Enum

class EmergencyButton(Enum):    # 10. hane
    Yes = "1"
    No = "2"

class MidMeter(Enum):           # 9. hane
    Yes = "1"
    No = "2"

class System(Enum):             # 8. hane
    RFID = "1"                                # Personal
    RFID_Wifi_Ethernet_Bluetooth = "2"        # Smart
    RFID_Wifi_Ethernet_Bluetooth_4G = "3"     # Smart+

class BodyColor(Enum):          # 6-7. hane
    White = "01"           
    Gray = "02"       
    DarkGrey = "03"     
    Black = "04"       
    Red = "05"           
    Green = "06"         
    Blue = "07"          

class OutputPower(Enum):        # 5. hane
    Max32A_7kW = "1"      # Max. 32A - 7.4kW
    Max32A_22kW = "3"     # Max. 32A - 22kW

class ConnectorType(Enum):      # 4. hane
    Type2_Cable = "1"
    Type2_Socket = "2"

class Case_Type(Enum):          # 0-3. hane
    CaseB = "HC02"


class DeviceModel():
    def __init__(self, application):
        self.application = application

        self.ItemCode = None
        self.emergencyButton = None 
        self.midMeter = None
        self.system = None
        self.bodyColor = None
        self.outputPower = None
        self.connectorType = None
        self.caseType = None

    def find(self, itemCode : str):
        try:
            self.ItemCode = itemCode
            self.caseType = Case_Type(itemCode[0:4])
            self.connectorType = ConnectorType(itemCode[4])
            self.outputPower = OutputPower(itemCode[5])
            self.bodyColor = BodyColor(itemCode[6:8])
            self.system = System(itemCode[8])
            self.midMeter = MidMeter(itemCode[9])
            self.emergencyButton = EmergencyButton(itemCode[10])

            print(self.caseType)
            print(self.connectorType)
            print(self.outputPower)
            print(self.bodyColor)
            print(self.system)
            print(self.midMeter)
            print(self.emergencyButton)
        except Exception as e:
            print("Exception:",e)

deviceModel = DeviceModel(None)
deviceModel.find("HC021103222")

