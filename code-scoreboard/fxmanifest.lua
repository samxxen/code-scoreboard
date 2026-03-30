server_script '@ElectronAC/src/include/server.lua'
client_script '@ElectronAC/src/include/client.lua'
fx_version 'cerulean'
game 'gta5'
lua54 'yes'
author 'samxxen'
description 'codescript'

shared_script 'config.lua'
client_script 'cl_main.lua'
server_script 'sv_main.lua'

ui_page 'web/ui.html'

files {
    'web/*'
}
server_scripts { '@mysql-async/lib/MySQL.lua',}