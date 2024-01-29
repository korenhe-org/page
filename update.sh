#!/bin/bash

DB3FRONTEND_FOLDER=../db3-frontend

cp ${DB3FRONTEND_FOLDER}/lib/db3_wasm.wasm .
cp ${DB3FRONTEND_FOLDER}/lib/db3_wasm.js .
cp ${DB3FRONTEND_FOLDER}/lib/shell.js .
cp ${DB3FRONTEND_FOLDER}/lib/term.html .
cp ${DB3FRONTEND_FOLDER}/lib/wasm.interface.js .

sed -i 's|node_modules/xterm/css|styles|g' term.html
sed -i 's|node_modules/xterm/lib|js|g' term.html
