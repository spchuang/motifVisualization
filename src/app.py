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
		for (dirpath, dirnames, filenames) in walk('data/type1'):
		    type1_folders.extend(dirnames)
		    break
		    
		type2_folders = []
		for (dirpath, dirnames, filenames) in walk('data/type2'):
		    type2_folders.extend(dirnames)
		    break    
		    
		return simplejson.dumps(dict(type1_folders=type1_folders, type2_folders=type2_folders))
		
	#result 1 shows the template assignment
	@cherrypy.expose()
	def get_result_1_data(self, folderName):
		folderPath = 'data/type1/'+folderName;
		celltypes = []
		for (dirpath, dirnames, filenames) in walk(folderPath):
		    celltypes.extend(dirnames)
		    break
		#return simplejson.dumps(dict( type2_folders=celltypes))
		
		result=dict()
		result['id'] = folderName
		result['celltypes'] = celltypes
		result['data'] = {}
		result['templateSignal'] = []
		#read template signal
		centroid=0
		index=0
		templateData =[]
		#read footprints
		try:
			templateFile = open(folderPath+'/templateSignal')
			
		except IOError:
			return simplejson.dumps(dict(error='contect not found'))

		for line in templateFile:	
			if not line[0] == '"':
				templateData.append(line.split()[1])
				index = index+1
				
			##add centroid count
			if index == 30:
				result['templateSignal'].append({'name': 'template %d' %(centroid+1), 'data': templateData})
				centroid = centroid +1
				index = 0
				templateData =[]


		
		for c in celltypes:
			result['data'][c] ={}
			
		
			result['data'][c]['correlation'] = []
			result['data'][c]['count'] = []
		
			result['data'][c]['fpSignal'] = []
			result['data'][c]['conservationLevel'] = []
			
			centroid=0;
			index=0;
			fpData =[]
			#read footprints
			fpFile = open(folderPath+'/'+c+'/fpsig')
			for line in fpFile:	
				if not line[0] == '"':
					fpData.append(line.split()[1])
					index = index+1
					
				##add centroid count
				if index == 30:
					result['data'][c]['fpSignal'].append({'name': 'footprint %d' %(centroid+1), 'data': fpData})
					centroid = centroid +1
					index = 0
					fpData =[]
		
			#read conservation level	
			centroid=0
			index=0
			consData = []
			consFile = open(folderPath+'/'+c+'/consSig')
			for line in consFile:	
				if not line[0] == '"':
					consData.append(line.split()[1])
					index = index+1
					
				##add centroid count
				if index == 30:
					result['data'][c]['conservationLevel'].append({'name': 'conservation %d' %(centroid+1), 'data': consData})
					centroid = centroid +1
					index = 0
					fpData =[]
					consData = []
			
			
		
			#read correlation
			corrFile = open(folderPath+'/'+c+'/cor-level.txt')
			for line in corrFile:	
				try:
					result['data'][c]['correlation'].append(float(line))

				except ValueError:
					print "no"
			
			#read count
			countFile = open(folderPath+'/'+c+'/'+c+'.count')
			for line in countFile:	
				try:
					result['data'][c]['count'].append(float(line))

				except ValueError:
					print "no"
					
					
							
			
		return simplejson.dumps(result)
		
	#result 2 shows the motif pattern (super similar to func for result 1 lol)
	@cherrypy.expose()
	def get_result_2_data(self, folderName):
		folderPath = 'data/type2/'+folderName;
		celltypes = []
		for (dirpath, dirnames, filenames) in walk(folderPath):
		    celltypes.extend(dirnames)
		    break
		#return simplejson.dumps(dict( type2_folders=celltypes))
		
		result=dict()
		result['id'] = folderName
		result['celltypes'] = celltypes
		result['data'] = {}
		#read template signal
		centroid=0
		index=0
		
		for c in celltypes:
			result['data'][c] ={}
			result['data'][c]['correlation'] = []
			result['data'][c]['motif'] = []
		
			result['data'][c]['fpSignal'] = []
			result['data'][c]['conservationLevel'] = []
			
			centroid=0;
			index=0;
			fpData =[]
			#read footprints
			fpFile = open(folderPath+'/'+c+'/fpsig')
			for line in fpFile:	
				if not line[0] == '"':
					fpData.append(line.split()[1])
					index = index+1
					
				##add centroid count
				if index == 30:
					result['data'][c]['fpSignal'].append({'name': 'footprint %d' %(centroid+1), 'data': fpData})
					centroid = centroid +1
					index = 0
					fpData =[]
		
			#read conservation level	
			centroid=0
			index=0
			consData = []
			consFile = open(folderPath+'/'+c+'/consSig')
			for line in consFile:	
				if not line[0] == '"':
					consData.append(line.split()[1])
					index = index+1
					
				##add centroid count
				if index == 30:
					result['data'][c]['conservationLevel'].append({'name': 'conservation %d' %(centroid+1), 'data': consData})
					centroid = centroid +1
					index = 0
					fpData =[]
					consData = []
			
			
		
			#read correlation
			corrFile = open(folderPath+'/'+c+'/cor-level.txt')
			for line in corrFile:	
				try:
					result['data'][c]['correlation'].append(float(line))

				except ValueError:
					print "no"
			
			#read count
			countFile = open(folderPath+'/'+c+'/motifOrder.txt')
			for line in countFile:	
				if not line[0] == 'T':
					result['data'][c]['motif'].append(line)

					
							
			
		return simplejson.dumps(result)
    
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
