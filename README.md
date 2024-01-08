# Installation

```bash
git clone --bare https://github.com/m4cey/dotfiles .dotfiles
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
dotfiles checkout -f
```
