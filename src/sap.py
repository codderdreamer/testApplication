import requests

class SAP():
    def __init__(self, application):
        self.application = application
        self.base_url = "https://10.254.240.20:50000/b1s/v1"
        self.login_url = f"{self.base_url}/Login"
        self.serialNumberDetails_url = f"{self.base_url}/SerialNumberDetails"
        self.session_id = None
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
        if not self.session_id and not self.login():
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