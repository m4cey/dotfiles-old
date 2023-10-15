#!/bin/bash

. $HOME/.xprofile
# xterm &
exec ssh-agent dbus-run-session dwm
