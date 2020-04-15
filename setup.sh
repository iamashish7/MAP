cp -a ./code/. /var/www/html/
/var/www/html/realtime/2010/HPC2010_daemon.sh &
/var/www/html/realtime/2013/HPC2013_daemon.sh &
echo "Please enter root user MySQL password!"
echo "Note: password will be hidden when typing"
read -s rootpasswd
mysql -uroot -p${rootpasswd} -e "CREATE DATABASE SavedLogs;"
mysql -uroot -p${rootpasswd} -e "CREATE DATABASE tempLogs;"
#echo "Please enter the NAME of the new MySQL database user! (recommended: monalys)"
#read username
#echo "Please enter the PASSWORD for the new MySQL database user!"
#echo "Note: password will be hidden when typing"
#read -s userpass
#echo "Creating new user..."
#mysql -uroot -p${rootpasswd} -e "CREATE USER ${username}@localhost IDENTIFIED BY '${userpass}';"
#echo "User successfully created!"
mysql -uroot -p${rootpasswd} -e "CREATE USER monalys@localhost IDENTIFIED BY 'monalys';"
echo ""
echo "Granting privileges!"
mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON SavedLogs.* TO '${username}'@'localhost';"
mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON tempLogs.* TO '${username}'@'localhost';"
mysql -uroot -p${rootpasswd} -e "FLUSH PRIVILEGES;"
$ python /var/www/html/new/code/parser/parser_pbs_multifile.py
$ python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/CTC-SP2-1996-3.swf CTC_SP2
$ python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/SDSC-BLUE-2000-4.swf SDSC_BLUE
$ python /var/www/html/new/code/parser/parser_swf_saved.py /var/www/html/new/code/Logs/SDSC-SP2-1998-4.swf SDSC_SP2