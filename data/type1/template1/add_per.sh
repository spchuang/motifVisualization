touch per
touch corr
for i in {0..100}
do
    echo $i
	if [ "$i" -eq "0" ]; then
		for f in `ls -d */`; do
			cell=`echo -n $f | sed 's/\/$//'`
			
			echo -n $cell >> per
			printf "\t" >> per
			echo -n $cell >> corr
			printf "\t" >> corr
		done
	else
		for f in `ls -d */`; do
			cell=`echo -n $f | sed 's/\/$//'`
			if [ -f "$cell/$cell.count" ]; then
				
				cat $cell/$cell.count | sed -n "$i p" | tr -d '\n' >> per
			else
				echo -n "NaN" >> per
			fi
			j=$((i+1))
			
			cat $cell/cor-level.txt | sed -n "$j p" | tr -d '\n' >> corr
			
			
			printf "\t" >> per
			printf "\t" >> corr
			
		done
    fi
        
	printf "\n" >> per
	printf "\n" >> corr
 	
done



