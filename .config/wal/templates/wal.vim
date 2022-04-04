" =============================================================================
" Filename: autoload/lightline/colorscheme/wal.vim
" Author: Dylan Araps
" License: MIT License
" Last Change: 2017/10/28 12:21:04.
" =============================================================================

let s:black = [ '{background}', 232 ]
let s:gray = [ '{color0}', 0 ]
let s:white = [ '{foreground}', 7 ]
let s:darkblue = [ '{color2}', 4 ]
let s:cyan = [ '{color3}', 6 ]
let s:green = [ '{color4}', 2 ]
let s:orange = [ '{color5}', 5 ]
let s:purple = [ '{color6}', 1 ]
let s:red = [ '{color7}', 1 ]
let s:yellow = [ '{color8}', 3 ]

let s:p = {{'normal': {{}}, 'inactive': {{}}, 'insert': {{}}, 'replace': {{}}, 'visual': {{}}, 'tabline': {{}}}}
let s:p.normal.left = [ [ s:black, s:purple ], [ s:cyan, s:gray ] ]
let s:p.normal.right = [ [ s:black, s:purple ], [ s:black, s:darkblue ] ]
let s:p.inactive.right = [ [ s:black, s:gray ], [ s:white, s:black ] ]
let s:p.inactive.left =  [ [ s:cyan, s:black ], [ s:white, s:black ] ]
let s:p.insert.left = [ [ s:black, s:green ], [ s:cyan, s:gray ] ]
let s:p.replace.left = [ [ s:black, s:red ], [ s:cyan, s:gray ] ]
let s:p.visual.left = [ [ s:black, s:orange ], [ s:cyan, s:gray ] ]
let s:p.normal.middle = [ [ s:white, s:gray ] ]
let s:p.inactive.middle = [ [ s:white, s:gray ] ]
let s:p.tabline.left = [ [ s:darkblue, s:gray ] ]
let s:p.tabline.tabsel = [ [ s:gray, s:cyan ] ]
let s:p.tabline.middle = [ [ s:darkblue, s:gray ] ]
let s:p.tabline.right = [ [ s:gray, s:gray ] ] "copy(s:p.normal.right)
let s:p.normal.error = [ [ s:red, s:black ] ]
let s:p.normal.warning = [ [ s:yellow, s:black ] ]

let g:lightline#colorscheme#wal#palette = lightline#colorscheme#flatten(s:p)
