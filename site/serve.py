# -*- coding: utf-8 -*-
"""Servidor local do protótipo, sem cache.

O `python -m http.server` responde 304 e o navegador mantém o CSS antigo em
memória — o que faz um ajuste de cor parecer que não foi aplicado. Este envia
no-store em tudo, então cada F5 traz a versão do disco.

Uso:  python serve.py [porta]
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SemCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # menos ruído no terminal
        if "304" not in (args[1] if len(args) > 1 else ""):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f"Protótipo Juma-Agro USA em http://localhost:{porta}/index.html")
    print("Sem cache: cada F5 recarrega do disco.  Ctrl+C para parar.")
    ThreadingHTTPServer(("127.0.0.1", porta), SemCache).serve_forever()
