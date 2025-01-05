import psycopg2
from psycopg2.extras import RealDictCursor
import pandas as pd
from pathlib import Path


class Config():
    def __init__(self):
        # PostgreSQL bağlantı bilgileri
        self.db_params = {
            "dbname": "hera",
            "user": "postgres",
            "password": "1234",
            "host": "localhost",
            "port": "5432"
        }
        
        # Config değişkenleri
        self.wifiSSID = ""
        self.wifiPassword = ""
        self.fourG_apn = ""
        self.fourG_user = ""
        self.fourG_password = ""
        self.fourG_pin = ""

        self.bluetooth_key = None
        self.bluetooth_iv_key = None
        self.bluetooth_password = None

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

        self.ac_device_ip = ""
        self.ac_device_port = "9000"  # Varsayılan port

        # Tablo kontrolü ve oluşturma
        self.create_config_table()
        self.create_product_info_table()
        self.create_test_log_table()

        # Config'i oku
        self.read_config()

        self.cancel_test = False

    def get_db_connection(self):
        """PostgreSQL bağlantısı oluştur"""
        try:
            conn = psycopg2.connect(**self.db_params)
            return conn
        except Exception as e:
            print(f"Database bağlantı hatası: {e}")
            return None

    def read_config(self):
        """Configürasyonu veritabanından oku"""
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM config")
                    config = cur.fetchone()
                    if config:
                        self.wifiSSID = config['wifi_ssid']
                        self.wifiPassword = config['wifi_password']
                        self.fourG_apn = config['four_g_apn']
                        self.fourG_user = config['four_g_user']
                        self.fourG_password = config['four_g_password']
                        self.fourG_pin = config['four_g_pin']
                        self.ac_device_ip = config['ac_device_ip']
                        self.ac_device_port = config['ac_device_port']
                        self.selectedUSB = config['selected_usb']
            except Exception as e:
                print(f"Config okuma hatası: {e}")
            finally:
                conn.close()

    def write_config(self):
        """Configürasyonu veritabanına yaz"""
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor() as cur:
                    cur.execute("TRUNCATE TABLE config")
                    
                    cur.execute("""
                        INSERT INTO config (
                            wifi_ssid, wifi_password, four_g_apn, 
                            four_g_user, four_g_password, four_g_pin,
                            ac_device_ip, ac_device_port, selected_usb
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        self.wifiSSID, self.wifiPassword, self.fourG_apn,
                        self.fourG_user, self.fourG_password, self.fourG_pin,
                        self.ac_device_ip, self.ac_device_port, self.selectedUSB
                    ))
                    conn.commit()
            except Exception as e:
                print(f"Config yazma hatası: {e}")
                conn.rollback()
            finally:
                conn.close()

    def create_config_table(self):
        """Config tablosunu kontrol et ve yoksa oluştur"""
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS config (
                            wifi_ssid VARCHAR(100),
                            wifi_password VARCHAR(100),
                            four_g_apn VARCHAR(100),
                            four_g_user VARCHAR(100),
                            four_g_password VARCHAR(100),
                            four_g_pin VARCHAR(20),
                            ac_device_ip VARCHAR(15),
                            ac_device_port VARCHAR(5),
                            selected_usb VARCHAR(100)
                        )
                    """)
                    
                    cur.execute("SELECT COUNT(*) FROM config")
                    count = cur.fetchone()[0]
                    
                    if count == 0:
                        cur.execute("""
                            INSERT INTO config (
                                wifi_ssid, wifi_password, four_g_apn, 
                                four_g_user, four_g_password, four_g_pin,
                                ac_device_ip, ac_device_port, selected_usb
                            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, ('', '', '', '', '', '', '172.16.0.104', '9000', ''))
                    
                    conn.commit()
            except Exception as e:
                print(f"Tablo oluşturma hatası: {e}")
                conn.rollback()
            finally:
                conn.close()

    def create_product_info_table(self):
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor() as cur:
                    # Tablo oluştur
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS product_info (
                            id SERIAL PRIMARY KEY,
                            serial_number VARCHAR(100),
                            product_code VARCHAR(100),
                            charge_point_id VARCHAR(100),
                            ethernet_mac VARCHAR(100),
                            bluetooth_mac VARCHAR(100),
                            four_g_imei VARCHAR(100),
                            master_card_rfid VARCHAR(100),
                            slave_1_card_rfid VARCHAR(100),
                            slave_2_card_rfid VARCHAR(100),
                            product_description VARCHAR(500),
                            bluetooth_key VARCHAR(100),
                            bluetooth_iv_key VARCHAR(100),
                            bluetooth_password VARCHAR(100),
                            location VARCHAR(100)
                        )
                    """)
                    
                    # Tablo boş mu kontrol et
                    cur.execute("SELECT COUNT(*) FROM product_info")
                    count = cur.fetchone()[0]
                    
                    if count == 0:
                        # Excel dosyasını oku
                        excel_path = Path("HeraChargePack.xlsx")
                        if excel_path.exists():
                            df = pd.read_excel(excel_path)
                            
                            # Her satır için insert işlemi yap
                            for _, row in df.iterrows():
                                cur.execute("""
                                    INSERT INTO product_info (
                                        serial_number, product_code, charge_point_id,
                                        ethernet_mac, bluetooth_mac, four_g_imei,
                                        master_card_rfid, slave_1_card_rfid, slave_2_card_rfid,
                                        product_description, bluetooth_key, bluetooth_iv_key,
                                        bluetooth_password, location
                                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """, (
                                    row.get('Serial Number', ''),
                                    row.get('Product Code', ''),
                                    row.get('CPID', ''),
                                    row.get('Ethernet MAC', ''),
                                    row.get('BT MAC', ''),
                                    row.get('4G IMEI', ''),
                                    row.get('Master Card RFID', ''),
                                    row.get('Slave Kart RFID1', ''),
                                    row.get('Slave Kart RFID2', ''),
                                    row.get('Product Descriptions', ''),
                                    row.get('Aes Key', ''),
                                    row.get('Aes IV', ''),
                                    row.get('BLE Auth Passcode', ''),
                                    row.get('Location', '')
                                ))
                            print("Excel verileri başarıyla içe aktarıldı.")
                        else:
                            print("HeraChargePack.xlsx dosyası bulunamadı.")
                    
                    conn.commit()
            except Exception as e:
                print(f"product_info tablosu oluşturma hatası: {e}")
                conn.rollback()
            finally:
                conn.close()

    def create_test_log_table(self):
        """Test log tablosunu oluştur"""
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS test_logs (
                            id SERIAL PRIMARY KEY,
                            seri_no VARCHAR(100),
                            test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            step2 BOOLEAN,
                            step3 BOOLEAN,
                            step4 BOOLEAN,
                            step5 BOOLEAN,
                            step6 BOOLEAN,
                            step7 BOOLEAN,
                            step8 BOOLEAN,
                            step9 BOOLEAN,
                            step10 BOOLEAN,
                            step11 BOOLEAN,
                            step12 BOOLEAN,
                            step13 BOOLEAN,
                            step14 BOOLEAN,
                            step15 BOOLEAN,
                            step16 BOOLEAN,
                            step17 BOOLEAN,
                            step18 BOOLEAN,
                            step19 BOOLEAN,
                            step20 BOOLEAN,
                            step21 BOOLEAN,
                            step22 BOOLEAN,
                            step23 BOOLEAN,
                            step24 BOOLEAN
                        )
                    """)
                    conn.commit()
            except Exception as e:
                print(f"Test log tablosu oluşturma hatası: {e}")
                conn.rollback()
            finally:
                conn.close()

    def save_test_log(self, test_step, test_result):
        pass

    def get_product_info(self):
        """Tüm ürün bilgilerini getir"""
        conn = self.get_db_connection()
        if conn:
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT serial_number, product_code, charge_point_id,
                               ethernet_mac, bluetooth_mac, four_g_imei, 
                               master_card_rfid, slave_1_card_rfid, slave_2_card_rfid,
                               product_description, bluetooth_key, bluetooth_iv_key,
                               bluetooth_password, location 
                        FROM product_info
                    """)
                    return cur.fetchall()
            except Exception as e:
                print(f"Ürün bilgileri getirme hatası: {e}")
                return []
            finally:
                conn.close()
        return []

