#!/bin/bash

cd $HOME && git clone --bare https://github.com/m4cey/dotfiles .dotfiles
dotfiles="git --git-dir=.dotfiles --work-tree=$HOME"
$dotfiles checkout -f
cd $HOME/src/env && make install PREFIX=/.local/share MANPREFIX=/.local/share/man DESTDIR=$HOME
wal -n --theme "gruvbox" -o $HOME/.config/wal/postrun
