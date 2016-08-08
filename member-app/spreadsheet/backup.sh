now=$(date +%s)

#remove any backups over 1 month old
#for file in ./*.xlsx; do
#	echo $file
#	if [[ $file =~ backup_(.+)\.xlsx ]]; then
#		date=${BASH_REMATCH[1]}
#		date=$(echo $date | tr _ /)
#		timestamp=$(date -d $date +%s)
#		diff=$((($now-$timestamp)/86400))
#		if [[ $diff -gt 30 ]]; then
#			rm -f $file
#		fi
#	fi
#done

#download the latest copy of the spreadsheet
today=$(date +%D | tr / _)
filename='backup_'$today'.xlsx'
curl -o $filename https://docs.google.com/spreadsheets/d/1Tvsbvq-ErbVBDFaJyN9vtxOZcn3qtw9X6td78dXtmoE/export?format=xlsx
curl -o manufacturers/$filename https://docs.google.com/spreadsheets/d/1KKjRZym4L_ubQNv4KiPehidtDRKqsIljMxs2tg1ASg4/export?format=xlsx

