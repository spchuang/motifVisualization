
import os
from os import walk
import io
import sys
import re
import simplejson
'''
	process the motif json data. This way we can compare the percentage of motif assignments on each generated templates we have.

'''
'''
	process the folder for motif patterns
	data structured as 
		/motif1.csv
		/motif2.csv
		/motif3.csv
      
   inside motif.csv
      cell, 0 , 1, ......, 99
      AG.,  x , x, ......, x
      ....
'''
'''
   output:
   
   result = {
		'motif_name':[
		   {
   			'celltype1':{
   				'assign_percentage': [x,x,x,.....,x] (size = # of templates)
   			}
         },
         {
   			'celltpe2':{
   			   'assign_percentage': [x,x,x,....,x]
   			}
         },
			...	
		]
	}


'''
def convert_motif_pattern():
   folderName = '2_3_no_shift'
   folderPath = '../data/assign_motif/'+folderName;
   
   motifs = []
   for (dirpath, dirnames, filenames) in walk(folderPath):
      motifs.extend(filenames)
      break
   
   #print motifs
	
   result = dict()
   result['id'] = folderName
   result['data'] = {}
   #result['celltypes'] = json_data['celltypes']
   result['motifs']    = []
   for m in motifs:

      motif_name = m.split('.')[0]
      print motif_name
      #push the motif to the list of motifs
      if motif_name not in result['data']:
         result['data'][motif_name] = []
         result['motifs'].append(motif_name)
			
      isHeader = True
      #read the motif data
      mpFile = open(folderPath+'/'+m)
      for line in mpFile:
         if isHeader:
            isHeader = False
            continue
            
         temp = [x.strip() for x in line.split(',')]
         cell = temp[0]
         perc_assign = temp[1:]
         #remove the last element
         perc_assign.pop()

         data = {}
         data['celltype']			= cell
         data['perc_assign'] 			= perc_assign
         
         result['data'][motif_name].append(data)
       
   result['motifs'].sort()  
   with open("../json_data/type4/"+folderName+'/'+folderName+'.json', 'w') as outfile:
		simplejson.dump(result, outfile)
   return;
	
if __name__ == '__main__':
	convert_motif_pattern()