#!/bin/bash

. "$HOME/.xprofile"

exec dbus-launch --sh-syntax --exit-with-session dwm
# while true; do
# 	dbus-launch /usr/local/bin/dwm 2> /dev/null
# done
