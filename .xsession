#!/bin/bash

. $HOME/.xprofile
xterm &
exec dbus-run-session -- dwm
