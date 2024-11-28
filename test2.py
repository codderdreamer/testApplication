serial_number = "18932.HC021103222.00001"

# API URL
url = "https://10.254.240.20:50000/b1s/v1/SerialNumberDetails"

# Query Parameters
params = {
    "$select": "DocEntry,ItemCode,ItemDescription,MfrSerialNo,SerialNumber,U_4GImei,U_BluetoothMAC,U_EthernetMAC,U_CPID,U_MRFID,U_KRFID,U_KRFID1",
    "$filter": f"SerialNumber eq '{serial_number}'"  # Değişken kullanımı
}

print(params)