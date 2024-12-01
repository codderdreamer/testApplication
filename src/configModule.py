import json


class Config():
    def __init__(self):
        self.config_json_path = "src/config.json"

        self.wifiSSID = ""
        self.wifiPassword = ""
        self.fourG_apn = ""
        self.fourG_user = ""
        self.fourG_password = ""
        self.fourG_pin = ""

        self.selectedUSB = ""

        self.seriNo = ""
        self.chargePointId = ""
        self.master_card = None
        self.user_1_card = None
        self.user_2_card = None

        self.bluetooth_mac = None
        self.eth_mac = None
        self.mcu_error = None
        self.mcu_connection = None
        self.imei_4g = None
        self.wlan0_connection = None

        self.sap_save_device = None

        self.read_config_json()

        self.cancel_test = False

    # "wifiSSID" : "HERA_CHARGEPACK_TESTDESK",
    # "wifiPassword" : "NhP5&sF1Dp",
    # "fourG_apn" : "internet",
    # "fourG_user" : "",
    # "fourG_password" : "",
    # "fourG_pin" : "2000"

    def read_config_json(self):
        try:
            config_data = None
            with open(self.config_json_path, 'r') as file:
                config_data = json.load(file)

                self.wifiSSID = config_data["wifiSSID"]
                self.wifiPassword = config_data["wifiPassword"]
                self.fourG_apn = config_data["fourG_apn"]
                self.fourG_user = config_data["fourG_user"]
                self.fourG_password = config_data["fourG_password"]
                self.fourG_pin = config_data["fourG_pin"]
                
            print("config_data:",config_data)
        except Exception as e:
            print("read_config_json Exception:",e)

    def write_config_json(self):
        try:
            with open(self.config_json_path, 'w') as dosya:
                print("Config dosyasına yazılıyor.")
                config = {
                    "wifiSSID" : self.wifiSSID,
                    "wifiPassword" : self.wifiPassword,
                    "fourG_apn" : self.fourG_apn,
                    "fourG_user" : self.fourG_user,
                    "fourG_password" : self.fourG_password,
                    "fourG_pin" : self.fourG_pin
                }
                json.dump(config, dosya,ensure_ascii=False)
        except Exception as e:
            print("create_config_file Exception:", e)