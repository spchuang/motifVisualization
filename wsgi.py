import cherrypy    
import os
from src import app
 
ROOT_DIR = os.path.join(os.path.abspath("."))
port = int(os.environ.get("PORT", 5000))

config = {'/':
                {'tools.staticdir.on': True,
                 'tools.staticdir.dir': ROOT_DIR,

                 "server.socket_host": "0.0.0.0",
        		 "server.socket_port": port,		#was 8086

                }
        }
 
application = cherrypy.tree.mount(app.DataVisual(),config=config)
 

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', port, application, True)