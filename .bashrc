#stty -ixon -ixoff # In order to use Ctrl Q and ctrl S in vim
stty lnext '^-' stop undef start undef -ixon # In order to use Ctrl V in vim

if [[ -n "$BASH_VERSION" ]]; then # Bash
  complete -cf sudo # complete sudo command
  complete -cf man # complete man command
  # Get bash completion
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    source /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    source /etc/bash_completion
  elif [ -f /usr/local/share/bash-completion/bash_completion.sh ]; then
    source /usr/local/share/bash-completion/bash_completion.sh
  elif [ -f /usr/local/share/bash-completion/bash_completion ]; then
    source /usr/local/share/bash-completion/bash_completion
  elif [ -d "/usr/local/etc/bash_completion.d" ]; then # FreeBSD
    for f in /usr/local/etc/bash_completion.d/*; do
      source $f
    done
  fi
  export HISTCONTROL=ignoredups:erasedups # Ignore duplicate entries in .bash_history
  export HISTFILESIZE=
  export HISTSIZE=
  shopt -s histappend # Append history
  PROMPT_COMMAND="history -n; history -w; history -c; history -r; $PROMPT_COMMAND" # Write history immediately
  bind 'set completion-ignore-case on' # Ignore case
  bind '"\e[A": history-search-backward' # Up key is searching backward
  bind '"\e[B": history-search-forward'  # Down key is searching forward
  bind '\C-B:backward-kill-word'
  bind '\C-Z:undo'
  bind '\C-Y:redo'
  bind 'set show-all-if-ambiguous on'
  export COLOR_RESET="\[$(tput sgr0)\]" # No Color
  export COLOR_RED="\[$(tput setaf 1)\]"
  export COLOR_GREEN="\[$(tput setaf 2)\]"
  export COLOR_YELLOW="\[$(tput setaf 3)\]"
  export COLOR_BLUE="\[$(tput setaf 4)\]"
  export COLOR_PURPLE="\[$(tput setaf 5)\]"
  export COLOR_CYAN="\[$(tput setaf 6)\]"
  export COLOR_GRAY="\[$(tput setaf 7)\]"
  export COLOR_LIGHT_RED="\[$(tput setaf 1; tput bold)\]"
  export COLOR_LIGHT_GREEN="\[$(tput setaf 2; tput bold)\]"
  export COLOR_LIGHT_YELLOW="\[$(tput setaf 3; tput bold)\]"
  export COLOR_LIGHT_BLUE="\[$(tput setaf 4; tput bold)\]"
  export COLOR_LIGHT_PURPLE="\[$(tput setaf 5; tput bold)\]"
  export COLOR_LIGHT_CYAN="\[$(tput setaf 6; tput bold)\]"
  export COLOR_LIGHT_GRAY="\[$(tput setaf 7; tput bold)\]"
  # Minimal bash theme, USER@DOMAIN directory
  export PS1="${COLOR_LIGHT_RED}\u${COLOR_LIGHT_YELLOW}@${COLOR_LIGHT_GREEN}\h${COLOR_RESET} ${COLOR_LIGHT_BLUE}\w${COLOR_RESET}\n\$ "
fi

. "/home/mace/.local/share/cargo/env"
