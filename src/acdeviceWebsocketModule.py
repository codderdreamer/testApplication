
from threading import Thread
import websocket
import time
import json

class AcdeviceWebsocketModule():
    def __init__(self, application) -> None:
        self.application = application
        self.__connection = False
        self.websocket = None
        self.wait_timeout = 60*5 # 5dk
        Thread(target=self.websocket_thread,daemon=True).start()

    @property
    def connection(self):
        return self.__connection

    @connection.setter
    def connection(self, value):
        self.__connection = value

    def on_message(self, ws, message):
        print(f"Gelen mesaj: {message}")

    def on_error(self, ws, error):
        self.connection = False
        print(f"Hata: {error}")

    def on_close(self, ws, close_status_code, close_msg):
        self.connection = False
        print("Bağlantı kapatıldı")

    def on_open(self, ws):
        self.connection = True
        print("Bağlantı açıldı")

    def websocket_thread(self):
        while True:
            try:
                print("AC Cihazına bağlanma deneniyor...")
                self.websocket = websocket.WebSocketApp(
                    "ws://172.16.0.104:9000",
                    on_message=self.on_message,
                    on_error=self.on_error,
                    on_close=self.on_close,
                )
                self.websocket.on_open = self.on_open
                self.websocket.run_forever()
                print("Websocket kapatıldı.")
                self.connection = False
            except Exception as e:
                print("websocket_thread Exception:",e)
                self.connection = False
            time.sleep(5)

    def wait_ac_charger_connection(self):
        while True:
            time_start = time.time()
            try:
                if self.application.config.cancel_test:
                    print("Test iptal edildi!")
                    break
                if time.time() - time_start > self.wait_timeout:
                    self.application.frontendWebsocket.websocket.send_message_to_all(json.dumps({
                            "Command": "ACChargerConnectResult",
                            "Data": False
                        }))
                    break
                if self.connection:
                    self.application.frontendWebsocket.websocket.send_message_to_all(json.dumps({
                            "Command": "ACChargerConnectResult",
                            "Data": True
                        }))
                    break
            except Exception as e:
                print("wait_ac_charger_connection Exception:",e)
            time.sleep(3)

    def send_save_config(self):
        while True:
            time_start = time.time()
            try:
                if self.application.config.cancel_test:
                    print("Test iptal edildi!")
                    break
                if time.time() - time_start > self.wait_timeout:
                    print("5dk bounca bağlanamadı Config bilgisi gönderilemedi!")
                    break
                if self.connection:
                    self.websocket.send(json.dumps({
                            "Command": "SaveConfig",
                            "Data": {

                            }
                        }))
                    break
            except Exception as e:
                print("wait_ac_charger_connection Exception:",e)
            time.sleep(3)