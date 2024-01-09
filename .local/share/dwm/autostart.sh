#! /bin/zsh

pkill dunst
dunst &
pkill bar.sh
bar.sh &
playerctld daemon
xset r rate 300 50 &	# Speed xrate up
pkill xautolock
xautolock -time 20 -locker "slock" -notifier "notify-send 'sleeping in 10 seconds!'" -notify 10 &
rfkill block bluetooth
pkill picom
picom &
