# ** ==> USERNAME and SERVER_IP env variables are needed!!! <== **
echo "Start deploying ranger treejer web"

yarn web:prod

echo "web:prod is done"

SERVER_SSH="$SERVER_USERNAME@$SERVER_IP"
TIME_FOLDER=$(date +'%m-%d-%Y-%H%M')
TAR_FOLDER="web-build-$TIME_FOLDER.tar.gz"

echo "$(TIME_FOLDER) => Folder for deploying"

tar -zcvf "$TAR_FOLDER" web-build

echo "tar.gz file generated"

scp "$TAR_FOLDER" "$SERVER_SSH:/home/deploy/projects/mobiledev-build/$TAR_FOLDER"

echo "tar.gz successfully copied to server."

rm -rf "$TAR_FOLDER"

SSH_COMMAND="ssh $SERVER_SSH 'cd projects/mobiledev-build; pm2 delete dev; rm -rf web-build; tar -xvf $TAR_FOLDER; pm2 serve web-build 4000 --name \"dev\"'"
eval "${SSH_COMMAND}"
