#!/usr/bin/env bash

# Erik Lundmark <mail@elundmark.se>
# 2015-01-10

# Small task manager alternative using dmenu,
#  when you want to get information about your procs
#  without having to lauch a full task manager.

# Requires: ps
#           dmenu (pref. newest patched version)
#           node.js
#           xclip
#           kill

# This script will open up dmenu with all running procs listed w/
# PID      PPID     RSS      CMD
# 0        0        0mb      /full-path -args

# Sorted by rss usage, ie heaviest programs first

# You can then do one of followng things:
# - Hit enter with a line selected, which will copy the line to your clipboard using xclip
# - Hit tab, and add 'kill ' or 'KILL ' to the beginning of the line, whih will kill the process
#   * Uppercased KILL will use -SIGKILL, lowercase kill will use the default (-SIGTERM)
# You can also add ' :kill' or ' :KILL' to the end of the line (faster to type)

PROCS="$(ps -eao pid,ppid,rss,cmd | \
	sed -r 's/^.+[0-9].+grep[ ]--color=.+P.+$//' | \
	sed -r 's/[[:space:]]+$//g' | \
	sed '/^[[:space:]]*$/d' | \
	tail -n +2)"
#   1     0  3204 /sbin/init
#   2     0     0 [kthreadd]
#   3     2     0 [ksoftirqd/0]
#   5     2     0 [kworker/0:0H]
PROCS_SORTED="$(node -e '''
	var sre = /^(\d+)\D+(\d+)\D+(\d+)/i,
		ps = process.argv.slice(1).join("\n").split(/(\r?\n)+/),
		padd = function (s) {
			return s+(new Array(9-(s.length)).join(" "));
		};
	ps = ps.filter(function (l) {
		return !!(l.trim());
	}).map(function (l) {
		return l.replace(/(?:^\s+|\s+$)/g, "").replace(sre, function (m, $1, $2, $3) {
			var rss = Number($3);
			if (rss) rss = (rss/1000).toFixed(1);
			return padd($1)+padd($2)+padd(rss+"mb");
		});
	});
	ps.sort(function (a, b) {
		a = Number(a.match(sre)[3]);
		b = Number(b.match(sre)[3]);
		return a < b ? 1 : a > b ? -1 : 0;
	});
	process.stdout.write(padd("PID")+padd("PPID")+padd("RSS")+padd(" CMD")+"\n"+(ps.join("\n"))+"\n");
''' "$PROCS")"
DLINE="$(echo "$PROCS_SORTED" | \
	/usr/local/bin/dmenu -b -l 15 -fn Mono-9 -p ps -nb '#000000' -nf '#AAAAAA' -sb '#AAAAAA' -sf '#000000')"
DMENU_EC=$?
KILLPATT='^kill[[:space:]]+[0-9]+'
KILLPATT_END='[[:space:]]:kill$'
FKILL='^KILL[[:space:]]+[0-9]+'
FKILL_END='[[:space:]]:KILL$'
if [[ $DMENU_EC -eq 0 ]] && [[ "$DLINE" =~ $FKILL || "$DLINE" =~ $FKILL_END ]]; then
	kill -SIGKILL $(node -e 'var id = process.argv[1].match(/\d+/); process.stdout.write(id ? id[0] : "?");' "$DLINE")
elif [[ $DMENU_EC -eq 0 ]] && [[ "$DLINE" =~ $KILLPATT || "$DLINE" =~ $KILLPATT_END ]]; then
	kill $(node -e 'var id = process.argv[1].match(/\d+/); process.stdout.write(id ? id[0] : "?");' "$DLINE")
elif [[ $DMENU_EC -eq 0 ]] && [[ "$DLINE" =~ [0-9] ]]; then
	echo -n "$DLINE" | xclip -selection c
fi
exit $DMENU_EC
