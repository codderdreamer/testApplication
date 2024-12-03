
# "ItemCode": "HC021103222",
#   Case Type	        Connector Type	            Output Power	        Body Color	        System	                        MID Meter	    Emergency Button
#   Case B	            Type2 Socket	            Max. 32A - 7.4kW	    Red	                RFID,Wifi,Ethernet,Bluetooth	No	            No				
#     0-3	                4	                        5	                6-7	                8	                            9	            10

from src.enums import *


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


