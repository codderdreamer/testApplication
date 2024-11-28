from flask import Flask, Response, render_template, request, jsonify, session
from threading import Thread

class FlaskServer:
    def __init__(self, application) -> None:
        self.application = application
        self.app = Flask(__name__, static_url_path='',
                         static_folder='../frontend/build',
                         template_folder='../frontend/build')
        
        self.setup_routes()
        Thread(target=self.run,daemon=True).start()

    def setup_routes(self):
        @self.app.route("/")
        def main():
            return render_template("index.html")
        
        

    def run(self):
        try:
            self.app.run(use_reloader=False, host="127.0.0.1", port=80, threaded=True)
        except Exception as e:
            print("FlaskServer.py run Exception:",e)
