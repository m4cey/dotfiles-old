#! /bin/sh
setbg > /dev/null
#xinput --set-prop "TPPS/2 IBM TrackPoint" "libinput Scroll Method Enabled" 0 0 0
xrdb ${XDG_CONFIG_HOME:-$HOME/.config}/x11/xresources
remaps # run the remaps script, switching caps/esc and more; check it for more info
