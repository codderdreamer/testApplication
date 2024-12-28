import psycopg2
from psycopg2.extras import RealDictCursor


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