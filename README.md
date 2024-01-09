# Install script
```bash
curl -s https://raw.githubusercontent.com/m4cey/dotfiles/main/src/env/install.sh | bash
startx
```
# Manual Installation

## Setting up the environement
```bash
git clone --bare https://github.com/m4cey/dotfiles .dotfiles
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
dotfiles checkout -f
```
Clone submodules with:
```bash
dotfiles submodule update --init
```
Install them with:
```bash
cd $HOME/src/env; make install PREFIX=/.local/share MANPREFIX=/.local/share/man DESTDIR=~
```
Or for a global install:
```bash
cd $HOME/src/env; sudo make install
```
## Finally install [pywal](https://github.com/dylanaraps/pywal) with your preferred method
and run `wal --theme "gruvbox" -o $HOME/.config/wal/postrun` to initialize configuration files

## Other (optional but recommended for oftb experience) dependencies include:
- playerctl
- xbacklight
- xorg-setxkbmap
- xorg-xset
- xorg-xmodmap
- ranger
- btop
- fzwal

# IMPORTANT:
change the font in `~/.config/x11/xresources_template` to a valid font on your system.

# Tips

* Set the wallpaper with `setbg image.jpg`
* Change the colorscheme with `fzwal`
* Copy new fonts to `~/.local/share/fonts` and then run `fc-cache -f` or install them with your package manager.
* [pywal](https://github.com/dylanaraps/pywal) takes care of generating config files for all programs that accept a colorscheme. Each config files comes with a `_template` version that you should modify instead of the normal one. these get passed to pywal and the output is placed in the proper place. just run `setbg` after modifying templates to apply them. Look at `~/.config/wal/postrun` for details.

# Credits
* wm forked from [chadwm](https://github.com/siduck/chadwm/)
* some scripts and st/dmenu forks based on [LARBS](https://github.com/LukeSmithxyz/LARBS)
