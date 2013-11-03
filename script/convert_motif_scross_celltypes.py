import os
from os import walk
import io
import sys

if __name__ == '__main__':
	folderPath = 'data/type1/'+folderName;
	celltypes = []
	for (dirpath, dirnames, filenames) in walk('../data/type2/test_motif_pattern9-20'):
	    celltypes.extend(dirnames)
	    break
	print celltypes
    # your code