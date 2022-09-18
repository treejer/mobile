#!/bin/bash

#  ==> USERNAME and SERVER_IP env variables are needed!!! <==

echo "Start to build web production ..."

yarn web:build

echo "web:prod is done"

SERVER_SSH="$SERVER_USERNAME@$SERVER_IP"
TIME_FOLDER=$(date +'%m-%d-%Y-%H%M')
if
    [[ "$PORT" -eq "" || "$PORT" -eq "4000" ]];
then
    PORT_LOCAL=4000;
    SERVER_FOLDER="/home/deploy/projects/mobiledev-build"
    PM2_NAME="dev";
else
    PORT_LOCAL=$PORT;
    SERVER_FOLDER="/home/deploy/projects/mobile-build"
    PM2_NAME="main";
fi
BUILD_TAR_FILE="web-build-$TIME_FOLDER.tar.gz"

echo "Start deploying ranger treejer web to $SERVER_IP on port $PORT_LOCAL"

echo "$(TIME_FOLDER) => Folder for deploying"

tar -zcvf "$BUILD_TAR_FILE" web-build

echo "tar.gz file generated"

scp "$BUILD_TAR_FILE" "$SERVER_SSH:$SERVER_FOLDER/$BUILD_TAR_FILE"

echo "tar.gz successfully copied to server."

rm -rf "$BUILD_TAR_FILE"

SSH_COMMAND="ssh $SERVER_SSH 'cd $SERVER_FOLDER; pm2 delete $PM2_NAME; rm -rf web-build; tar -xvf $BUILD_TAR_FILE; pm2 serve web-build $PORT_LOCAL --name $PM2_NAME;'"
eval "${SSH_COMMAND}"
