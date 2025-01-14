


class TestStep:
    def __init__(self, application):
        self.application = application

    def save_test_log_1(self):
        test_step = {
            1: {
                "description": f"Cihaz Seri No: {self.application.config.seriNo}",
                "value": True
            }
        }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_2(self,result):
        if result:
            test_step = {
                            2: {
                                "description": f"SAP Seri No Bilgileri",
                                "value": True,
                                "sub_steps": {
                                    1: {
                                        "description": f"ItemCode: {self.application.deviceModel.ItemCode}",
                                        "value": True
                                    },
                                    2: {
                                        "description": f"Emergency Button: {self.application.deviceModel.emergencyButton}",
                                        "value": True
                                    },
                                    3: {
                                        "description": f"MID Meter: {self.application.deviceModel.midMeter}",
                                        "value": True
                                    },
                                    4: {
                                        "description": f"System: {self.application.deviceModel.system}",
                                        "value": True
                                    },
                                    5: {
                                        "description": f"Body Color: {self.application.deviceModel.bodyColor}",
                                        "value": True
                                    },
                                    6: {
                                        "description": f"Connector Type: {self.application.deviceModel.connectorType}",
                                        "value": True
                                    },
                                    7: {
                                        "description": f"Case Type: {self.application.deviceModel.caseType}",
                                        "value": True
                                    }
                                }
                            }
                        }
        else:
            test_step = {
                2: {
                    "description": f"SAP Seri No Bilgileri Alınamadı!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_3(self):
        test_step = {
                        3: {
                            "description": f"Charge Point ID: {self.application.config.chargePointId}",
                            "value": True
                        }
                    }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_4(self,result):
        if result:
            test_step = {
                4: {
                    "description": f"Cihaz teste hazır.",
                    "value": True
                }
            }
        else:
            test_step = {
                4: {
                    "description": f"Cihaz teste hazır değil!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_5(self,result):
        if result:
            test_step = {
                5: {
                    "description": f"AC Charger'a bağlandı.",
                    "value": True
                }
            }
        else:
            test_step = {
                5: {
                    "description": f"AC Charger'a bağlanılamadı!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_6(self,result):
        if result:
            test_step = {
                6: {
                    "description": f"MCU firmware güncellendi.",
                    "value": True
                }
            }
        else:
            test_step = {
                6: {
                    "description": f"MCU firmware güncellenemedi!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_7(self,result):
        if result:
            test_step = {
                7: {
                    "description": f"Master kart kayıt edildi: {self.application.config.master_card}",
                    "value": True
                }
            }
        else:
            test_step = {
                7: {
                    "description": f"Master kart kayıt edilemedi!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_8(self,result):
        if result:
            test_step = {
                8: {
                    "description": f"Birinci kullanıcı kart kayıt edildi: {self.application.config.user_1_card}",
                    "value": True
                }
            }
        else:
            test_step = {
                8: {
                    "description": f"Birinci kullanıcı kart kayıt edilemedi!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_9(self,result):
        if result:
            test_step = {
                9: {
                    "description": f"İkinci kullanıcı kart kayıt edildi: {self.application.config.user_2_card}",
                    "value": True
                }
            }
        else:
            test_step = {
                9: {
                    "description": f"İkinci kullanıcı kart kayıt edilemedi!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_10(self,save_config_result_json_data):
        if save_config_result_json_data:
            test_step = {
                10: {
                    "description": "Sistem Kontrolleri",
                    "value": True,
                    "sub_steps": {
                        1: {
                            "description": f"Bluetooth MAC: {save_config_result_json_data['bluetooth_mac']}",
                            "value": save_config_result_json_data['bluetooth_mac'] is not None and save_config_result_json_data['bluetooth_mac'] != ""
                        },
                        2: {
                            "description": f"Ethernet MAC: {save_config_result_json_data['eth_mac']}",
                            "value": save_config_result_json_data['eth_mac'] is not None and save_config_result_json_data['eth_mac'] != ""
                        },
                        3: {
                            "description": "MCU Durumu",
                            "value": save_config_result_json_data['mcu_connection'] and not save_config_result_json_data['mcu_error'],
                            "sub_steps": {
                                1: {
                                    "description": "MCU Bağlantısı",
                                    "value": save_config_result_json_data['mcu_connection']
                                },
                                2: {
                                    "description": "MCU Hata Durumu",
                                    "value": not save_config_result_json_data['mcu_error']
                                }
                            }
                        },
                        4: {
                            "description": "WiFi Bağlantısı",
                            "value": save_config_result_json_data['wlan0_connection']
                        },
                        5: {
                            "description": f"4G IMEI: {save_config_result_json_data['imei_4g']}",
                            "value": save_config_result_json_data['imei_4g'] is not None and save_config_result_json_data['imei_4g'] != ""
                        }
                    }
                }
            }
            self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_11(self,result):
        if result:
            test_step = {
                11: {
                    "description": f"Bluetooth key üretildi.",
                    "value": True,
                    "sub_steps": {
                        1: {
                            "description": f"Bluetooth Key: {self.application.config.bluetooth_key}",
                            "value": True
                        },
                        2: {
                            "description": f"Bluetooth IV Key: {self.application.config.bluetooth_iv_key}",
                            "value": True
                        },
                        3: {
                            "description": f"Bluetooth Password: {self.application.config.bluetooth_password}",
                            "value": True
                        }
                    }
                }
            }
        else:
            test_step = {
                11: {
                    "description": f"Bluetooth key üretilemedi!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_12(self,result):
        if result:
            test_step = {
                12: {
                    "description": f"Şarj cihazı B konumuna getirildi.",
                    "value": True
                }
            }
        else:
            test_step = {
                12: {
                    "description": f"Şarj cihazı B konumuna getirilemedi!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_13(self,result):
        if result:
            test_step = {
                13: {
                    "description": f"Birinci kullanıcı kartı okutuldu.",
                    "value": True
                }
            }
        else:
            test_step = {
                13: {
                    "description": f"Birinci kullanıcı kartı okutulamadı!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_14(self,result):
        if result:
            test_step = {
                14: {
                    "description": f"Röle On oldu. Yük bankası devrede.",
                    "value": True
                }
            }
        else:
            test_step = {
                14: {
                    "description": f"Röle On olmadı!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_15(self,result):
        if result:
            test_step = {
                15: {
                    "description": f"Voltaj değerleri kontrol edildi.",
                    "value": True
                }
            }
        else:
            test_step = {
                15: {
                    "description": f"Voltaj değerleri doğrulanamadı!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_16(self,result):
        if result:
            test_step = {
                16: {
                    "description": f"Akım değerleri kontrol edildi.",
                    "value": True
                }
            }
        else:
            test_step = {
                16: {
                    "description": f"Akım değerleri doğrulanamadı!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_17(self,result):
        if result:
            test_step = {
                17: {
                    "description": f"Akım, Voltaj ve Güç değerleri kontrol edildi.",
                    "value": True
                }
            }
        else:
            test_step = {
                17: {
                    "description": f"Akım, Voltaj ve Güç değerleri doğrulanamadı!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_18(self,result):
        if result:
            test_step = {
                18: {
                    "description": f"Aşırı akım testi sırasında MCU'da hata gözlendi.",
                    "value": True
                }
            }
        else:
            test_step = {
                18: {
                    "description": f"Aşırı akım testi sırasında MCU'da hata yok!",
                    "value": False
                }
            }
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_19(self,result):
        if result:
            test_step = {
                19: {
                    "description": f"Şarj cihazı tekrar C state'ine geçti.",
                    "value": True
                }
            }
        else:
            test_step = {
                19: {
                    "description": f"Şarj cihazı tekrar C state'ine geçemedi!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_20(self,result):
        if result:
            test_step = {
                20: {
                    "description": f"Voltaj değerleri kontrol edildi doğrulandı.",
                    "value": True
                }
            }
        else:
            test_step = {
                20: {
                    "description": f"Voltaj değerleri doğrulanamadı!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_21(self,result):
        if result:
            test_step = {
                21: {
                    "description": f"RCD kaçak akım testi sırasında MCU'da hata gözlendi.",
                    "value": True
                }
            }
        else:
            test_step = {
                21: {
                    "description": f"RCD kaçak akım testi sırasında MCU'da hata yok!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_22(self,result):
        if result:
            test_step = {
                22: {
                    "description": f"Şarj cihazı tekrar A state'ine geçti.",
                    "value": True
                }
            }
        else:
            test_step = {
                22: {
                    "description": f"Şarj cihazı tekrar A state'ine geçemedi!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)

    def save_test_log_23(self,result):
        if result:
            test_step = {
                23: {
                    "description": f"Şarj cihazı SAP sistemine başarılı kayıt edildi.",
                    "value": True
                }
            }
        else:
            test_step = {
                23: {
                    "description": f"Şarj cihazı SAP sistemine kayıt edilemedi!",
                    "value": False
                }
            }   
        self.application.config.save_test_log(self.application.config.seriNo, test_step)
