#!/usr/bin/env python3
"""Simple HTTP server for ByBanx website."""
import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, fmt, *args):
        sys.stdout.write(f"[ByBanx] {self.log_date_time_string()} {fmt % args}\n")
        sys.stdout.flush()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"[ByBanx] Server running at http://0.0.0.0:{PORT}/")
    print(f"[ByBanx] Serving: {DIRECTORY}")
    sys.stdout.flush()
    httpd.serve_forever()
