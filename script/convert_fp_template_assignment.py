import os
import re
from os import walk
import io
import sys
import simplejson


'''
	process the fp assignment data into json format

'''

def convert_fp_pattern():
	file_name = 'template1'
	folderPath = '../data/type1/'+file_name;
	celltypes = []
	for (dirpath, dirnames, filenames) in walk(folderPath):
	    celltypes.extend(dirnames)
	    break
	#return simplejson.dumps(dict( type2_folders=celltypes))
	
	result=dict()
	result['id'] = file_name
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
				
				
						

	with open("../json_data/type1/"+file_name+'.json', 'w') as outfile:
		simplejson.dump(result, outfile)
		
	
	

if __name__ == '__main__':
	convert_fp_pattern()
		#return simplejson.dumps(dict(error='contect not found'))

