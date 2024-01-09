#! /bin/sh
setbg > /dev/null
xrdb ${XDG_CONFIG_HOME:-$HOME/.config}/x11/xresources
remaps # run the remaps script, switching caps/esc and more; check it for more info
