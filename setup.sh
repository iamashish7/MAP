sudo cp -a ./code/. /var/www/html/
echo "Please enter CC username"
read username
/var/www/html/realtime/2010/HPC2010_daemon.sh $username &
/var/www/html/realtime/2013/HPC2013_daemon.sh $username &
sudo mysql -e "CREATE DATABASE SavedLogs;"
sudo mysql -e "CREATE DATABASE tempLogs;"
sudo mysql -e "CREATE USER monalys@localhost IDENTIFIED BY 'monalys';"
echo ""
echo "Granting privileges!"
sudo mysql -e "GRANT ALL PRIVILEGES ON SavedLogs.* TO 'monalys'@'localhost';"
sudo mysql -e "GRANT ALL PRIVILEGES ON tempLogs.* TO 'monalys'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "done"
echo ""
echo "Inserting data to database"
python /var/www/html/parser/parser_pbs_multifile.py
python /var/www/html/parser/parser_swf_saved.py /var/www/html/Logs/CTC-SP2-1996-3.swf CTC_SP2
python /var/www/html/parser/parser_swf_saved.py /var/www/html/Logs/SDSC-BLUE-2000-4.swf SDSC_BLUE
python /var/www/html/parser/parser_swf_saved.py /var/www/html/Logs/SDSC-SP2-1998-4.swf SDSC_SP2
echo "done"
echo ""