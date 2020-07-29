#touch "`date`"
sleep 30
/usr/local/bin/pm2 start /home/aster/nodescript/atslog/atslog.js