import subprocess
from threading import Thread, Lock

connected_ips = []
lock = Lock()

def ping_ip(ip):
    # Windows için `-n 1` (1 ping gönder), `-w 1000` (1 saniye bekle)
    result = subprocess.run(['ping', '-n', '1', '-w', '1000', ip], stdout=subprocess.PIPE)
    if result.returncode == 0:
        # Sadece başarılı yanıt veren IP'leri ekle
        with lock:
            print("success", ip)
            connected_ips.append(ip)

def get_connected_ips(base_ip):
    threads = []

    for i in range(1, 255):
        ip = f"{base_ip}.{i}"
        thread = Thread(target=ping_ip, args=(ip,), daemon=True)
        threads.append(thread)
        thread.start()
    
    # Tüm thread'lerin tamamlanmasını bekleyin
    for thread in threads:
        thread.join()

    return connected_ips

# Kullanım
connected_ips = get_connected_ips("192.168.1")

# Tüm bağlı IP adreslerini gösterin
print("Bağlı IP adresleri:")
for ip in connected_ips:
    print(ip)
