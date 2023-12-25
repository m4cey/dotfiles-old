#! /bin/zsh

pkill dunst
dunst &
pkill bar.sh
bar.sh &
playerctld daemon
# xinput --set-prop "TPPS/2 IBM TrackPoint" "Coordinate Transformation Matrix" 6 0 0 0 6 0 0 0 1
xset r rate 300 50 &	# Speed xrate up
pkill xautolock
xautolock -time 20 -locker "slock" -notifier "notify-send 'sleeping in 10 seconds!'" -notify 10 &
rfkill block bluetooth
picom &
