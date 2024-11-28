import subprocess
from threading import Thread, Lock
import time
import socket

class FindEthernet():
    def __init__(self,application):
        self.application = application
        self.connected_ips = []
        self.lock = Lock()
        # Thread(target=self.get_connected_ips,daemon=True).start()

    def ping_ip(self,ip):
        result = subprocess.run(['ping', '-n', '1', '-w', '1000', ip], stdout=subprocess.PIPE)
        if result.returncode == 0:
            with self.lock:
                print("success", ip)
                self.connected_ips.append(ip)

    def get_connected_ips(self):
        while True:
            try:
                self.connected_ips = []
                time_start = time.time()
                threads = []
                base_ip = "192.168.1"
                local_ip = socket.gethostbyname(socket.gethostname())
                for i in range(1, 255):
                    ip = f"{base_ip}.{i}"
                    if ip.endswith(".1") or ip == local_ip:
                        continue
                    thread = Thread(target=self.ping_ip, args=(ip,), daemon=True)
                    threads.append(thread)
                    thread.start()

                for thread in threads:
                    thread.join()
                
                time_finish = time.time()

                print("tarama zamanı:",time_finish-time_start)

                self.application.aktive_eth = self.connected_ips
            except Exception as e:
                print("get_connected_ips Exception:",e)

            time.sleep(10)