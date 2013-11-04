import cherrypy
import os
from os import walk
import io
import sys
import simplejson


ROOT_DIR = os.path.join(os.path.abspath("."))
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


class DataVisual:
	@cherrypy.expose
	def index(self):
		return open(os.path.join(ROOT_DIR, u'index.html'))


	@cherrypy.expose
	def get_celltypes(self):
		celltypes = [line.strip() for line in open('data/celltypes')]
		return simplejson.dumps(dict(celltypes=celltypes))
		
	@cherrypy.expose
	def get_data_folders(self):
	#os.path.isdir(fileordirectoryname)
	
		type1_folders = []
		for (dirpath, dirnames, filenames) in walk('json_data/type1'):
			#print filenames
		    type1_folders.extend(dirnames)
		    break
		    
		type2_folders = []
		for (dirpath, dirnames, filenames) in walk('json_data/type2'):
		    type2_folders.extend(dirnames)
		    break    
		    
		return simplejson.dumps(dict(type1_folders=type1_folders, type2_folders=type2_folders))
		
		
	#result 1 shows the template assignment
	@cherrypy.expose()
	def get_fp_to_template_assignment(self, folderName):
		json_file=open('json_data/type1/'+folderName+'/'+folderName+'.json')
		json_data = simplejson.load(json_file)
		return simplejson.dumps(json_data)
		
	#result 2 shows the motif pattern (super similar to func for result 1 lol)
	@cherrypy.expose()
	def get_motif_pattern_data(self, folderName):

		json_file=open('json_data/type2/'+folderName+'/'+folderName+'.json')
		json_data = simplejson.load(json_file)
		return simplejson.dumps(json_data)
		
	#result 3 shows the motif pattern that is motif-based
	@cherrypy.expose()
	def get_motif_pattern_across_cell(self, folderName):

		json_file=open('json_data/type2/'+folderName+'/'+folderName+'_across_motifs.json')
		json_data = simplejson.load(json_file)
		return simplejson.dumps(json_data)
    
def setup_routes(routes):
    d = cherrypy.dispatch.RoutesDispatcher()

    for name, path, controller, action, method in routes:
        if path != "":
            path = "/%s" % path
        print "routing: /%s%s" % (name, path)
        d.connect(name, "/%s%s" % (name, path), controller, action=action,
                conditions=dict(method=[method]))
    return d

_data = DataVisual()
