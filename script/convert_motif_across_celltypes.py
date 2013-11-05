import os
import re
from os import walk
import io
import sys
import simplejson

'''
	process the motif json data and convert it to be motif-based instead of celltype-based
	so it allows us to compare the patterns of the same motif across different celltypes

'''

def convert_motifdata_to_motif_based():
	file_name = "test_motif_pattern9-20"
	json_file=open('../json_data/type2/'+file_name+'/'+file_name+'.json')
	json_data = simplejson.load(json_file)
	
	#get the values
	motif_data= json_data['data']

	result = {}
	result['data'] = {}
	result['id'] = json_data['id']
	result['celltypes'] = json_data['celltypes']
	result['motifs'] = []
	
	
	'''
	original
	motif_data = {
		'cell_type'={
			'fpSignal','consevationLevel','motif','correlation' (share the same index)
		}
	}
	change to 
	result = {
		'motif_name':{
			'celltype':{
				'fpSignal','conservationLevel'
			},
			...	
		}
	}
	'''
	
	for c in motif_data.keys():
		i = 0
		for m in motif_data[c]['motif']:
			motif_name = motif_data[c]['motif'][i].split(":")[0]
			motif_count = motif_data[c]['motif'][i].split(":")[1]
			#check if motif is already created
			if motif_name not in result['data']:
				result['data'][motif_name] = []
				result['motifs'].append(motif_name)
				
			
			data = {}
			data['celltype']			= c
			data['fpSignal'] 			= motif_data[c]['fpSignal'][i]['data']
			data['conservationLevel'] 	= motif_data[c]['conservationLevel'][i]['data']
			data['correlation'] 		= motif_data[c]['correlation'][i]
			data['count']				= motif_count
			
			result['data'][motif_name].append(data)
			i = i+1
			
	result['motifs'].sort()
	print result['motifs']

	with open("../json_data/type3/"+file_name+'/'+file_name+'.json', 'w') as outfile:
		simplejson.dump(result, outfile)
		
	
	

if __name__ == '__main__':
	convert_motifdata_to_motif_based()
	