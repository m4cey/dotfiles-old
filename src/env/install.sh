#!/bin/bash

cd $HOME && git clone --bare https://github.com/m4cey/dotfiles .dotfiles
alias dotfiles="git --git-dir=.dotfiles --work-tree=$HOME"
dotfiles checkout
source $HOME/.profile
cd $HOME/src/env && make install PREFIX=/.local/share MANPREFIX=/.local/share/man DESTDIR=$HOME
setbg
