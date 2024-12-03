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