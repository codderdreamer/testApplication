import requests

class SAP():
    def __init__(self, application):
        self.application = application
        self.base_url = "https://10.254.240.20:50000/b1s/v1"
        self.login_url = f"{self.base_url}/Login"
        self.serialNumberDetails_url = f"{self.base_url}/SerialNumberDetails"
        self.session_id = None
        self.DocEntry = None
        self.login_payload = {
            "CompanyDB": "HERATEST03",
            "Password": "3944",
            "UserName": "manager"
        }

    def login(self):
        try:
            headers = {
                "Content-Type": "application/json"
            }
            response = requests.post(self.login_url, headers=headers, json=self.login_payload, verify=False)
            if response.status_code == 200:
                data = response.json()
                self.session_id = data.get("SessionId")
                print("Login successful, SessionId:", self.session_id)
                return True
            else:
                print("Login failed:", response.status_code, response.text)
                return False
        except Exception as e:
            print("Login Exception:", e)
            return False

    def get_serialNumberDetails(self, serialNo):
        if not self.login():
            print("Unable to authenticate. Cannot proceed with the request.")
            return False
        try:
            print("Call /SerialNumberDetails")
            params = {
                "$select": "DocEntry,ItemCode,ItemDescription,MfrSerialNo,SerialNumber,U_4GImei,U_BluetoothMAC,U_EthernetMAC,U_CPID,U_MRFID,U_KRFID,U_KRFID1",
                "$filter": f"SerialNumber eq '{serialNo}'"
            }
            headers = {
                "Content-Type": "application/json",
                "Cookie": f"B1SESSION={self.session_id}"
            }

            response = requests.get(self.serialNumberDetails_url, headers=headers, params=params, verify=False)
            print("Response Status Code:", response.status_code)
            print("Response Text:", response.text)

            if response.status_code == 200:
                data = response.json()
                if "value" in data and len(data["value"]) > 0:
                    item = data["value"][0] 
                    ItemCode = item["ItemCode"]
                    self.DocEntry = item["DocEntry"]
                    print("ItemCode:", ItemCode)
                    self.application.deviceModel.find(ItemCode)
                    return True
                else:
                    print("No data found for the given serial number.")
                    return False
            else:
                print("Failed to retrieve SerialNumberDetails:", response.text)
                return False
        except Exception as e:
            print("get_serialNumberDetails Exception:", e)
            return False
        
    def update_serialNumberDetails(self):
        if not self.login():
            print("Unable to authenticate. Cannot proceed with the request.")
            return False
        try:
            print("Call /SerialNumberDetails (PATCH)")
            url = f"{self.serialNumberDetails_url}({self.DocEntry})"
            headers = {
                "Content-Type": "application/json",
                "Cookie": f"B1SESSION={self.session_id}"
            }

            update_data = {
                "U_4GImei": self.application.config.imei_4g,
                "U_BluetoothMAC": self.application.config.bluetooth_mac,
                "U_EthernetMAC": self.application.config.eth_mac,
                "U_CPID": self.application.config.chargePointId,
                "U_MRFID": self.application.config.master_card,
                "U_KRFID": self.application.config.user_1_card,
                "U_KRFID1": self.application.config.user_2_card,
                "U_AESKey": self.application.config.bluetooth_key,
                "U_AESIV": self.application.config.bluetooth_iv_key,
                "U_BLE_A_P": self.application.config.bluetooth_password
            }

            response = requests.patch(url, headers=headers, json=update_data, verify=False)
            print("Response Status Code:", response.status_code)
            print("Response Text:", response.text)

            if response.status_code == 204 or response.status_code == 200:
                print("Update successful.")
                return True
            else:
                print("Failed to update SerialNumberDetails:", response.text)
                return False
        except Exception as e:
            print("update_serialNumberDetails Exception:", e)
            return False

    def check_bluetooth_key_exists(self, key):
        if not self.login():
            print("Unable to authenticate. Cannot check bluetooth key.")
            return False
        try:
            params = {
                "$select": "U_AESKey",
                "$filter": f"U_AESKey eq '{key}'"
            }
            headers = {
                "Content-Type": "application/json",
                "Cookie": f"B1SESSION={self.session_id}"
            }
            
            response = requests.get(self.serialNumberDetails_url, headers=headers, params=params, verify=False)
            if response.status_code == 200:
                data = response.json()
                return len(data.get("value", [])) > 0
            return False
        except Exception as e:
            print("check_bluetooth_key_exists Exception:", e)
            return False

    def check_bluetooth_iv_exists(self, iv_key):
        if not self.login():
            print("Unable to authenticate. Cannot check bluetooth IV.")
            return False
        try:
            params = {
                "$select": "U_AESIV",
                "$filter": f"U_AESIV eq '{iv_key}'"
            }
            headers = {
                "Content-Type": "application/json",
                "Cookie": f"B1SESSION={self.session_id}"
            }
            
            response = requests.get(self.serialNumberDetails_url, headers=headers, params=params, verify=False)
            if response.status_code == 200:
                data = response.json()
                return len(data.get("value", [])) > 0
            return False
        except Exception as e:
            print("check_bluetooth_iv_exists Exception:", e)
            return False

    def check_bluetooth_password_exists(self, password):
        if not self.login():
            print("Unable to authenticate. Cannot check bluetooth password.")
            return False
        try:
            params = {
                "$select": "U_BLE_A_P",
                "$filter": f"U_BLE_A_P eq '{password}'"
            }
            headers = {
                "Content-Type": "application/json",
                "Cookie": f"B1SESSION={self.session_id}"
            }
            
            response = requests.get(self.serialNumberDetails_url, headers=headers, params=params, verify=False)
            if response.status_code == 200:
                data = response.json()
                return len(data.get("value", [])) > 0
            return False
        except Exception as e:
            print("check_bluetooth_password_exists Exception:", e)
            return False