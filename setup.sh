sudo mkdir /var/www/html/new
sudo mkdir /var/www/html/new/code
sudo cp -a ./code/. /var/www/html/new/code/
echo "Please enter CC username"
read username
/var/www/html/new/code/realtime/2010/HPC2010_daemon.sh $username &
/var/www/html/new/code/realtime/2013/HPC2013_daemon.sh $username &
sudo mysql -e "CREATE DATABASE SavedLogs;"
sudo mysql -e "CREATE DATABASE tempLogs;"
sudo mysql -e "CREATE USER monalys@localhost IDENTIFIED BY 'monalys';"
sudo mysql -e "GRANT ALL PRIVILEGES ON SavedLogs.* TO 'monalys'@'localhost';"
sudo mysql -e "GRANT ALL PRIVILEGES ON tempLogs.* TO 'monalys'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "Inserting data to database"
python /var/www/html/new/code/parser/parser_pbs_multifile.py
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/CTC-SP2-1996-3.swf CTC_SP2
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/SDSC-BLUE-2000-4.swf SDSC_BLUE
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/SDSC-SP2-1998-4.swf SDSC_SP2
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/CEA-Curie-2011-2.swf CEA_curie
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/HPC2N-2002-2.swf HPC2N
python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/DAS2-fs0-2003-1.swf DAS2
echo "done"
echo ""