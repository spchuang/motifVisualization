
import os
from os import walk
import io
import sys
import re
import simplejson
'''
	process the folder for motif patterns
	data structured as 
		/celltypes
			/consSig
			/fpsig
			/cor-level.txt
			/motifOrder.txt
'''
def convert_motif_pattern():
	folderName = 'average_chr1_chr7'
	folderPath = '../data/type2/'+folderName;
	celltypes = []
	for (dirpath, dirnames, filenames) in walk(folderPath):
	    celltypes.extend(dirnames)
	    break
	
	#
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
#		corrFile = open(folderPath+'/'+c+'/consSig')
#		for line in corrFile:	
#			try:
#				result['data'][c]['correlation'].append(float(line))
#
#			except ValueError:
#				print "no"
		
		#read count
		countFile = open(folderPath+'/'+c+'/motifOrder')
		for line in countFile:	
			if not line[0] == 'T':
				r = re.search('^[0-9]* : (.+)\(([0-9]*)\)',line)
				motif_name = r.group(1)
				motif_count = r.group(2)
				result['data'][c]['motif'].append(motif_name+":"+motif_count)
	#print result
	with open("../json_data/type2/"+folderName+'/'+folderName+'.json', 'w') as outfile:
		simplejson.dump(result, outfile)

if __name__ == '__main__':
	convert_motif_pattern()