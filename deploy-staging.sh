echo "Start deploying ranger treejer web"

#yarn web:prod

echo "web:prod is done"

TIME_FOLDER=$(date +'%m-%d-%Y-%H%M')
TAR_FOLDER="web-build-$TIME_FOLDER.tar.gz"

echo "$(TIME_FOLDER) => Folder for deploying"

tar -zcvf "$TAR_FOLDER" web-build

echo "tar.gz file generated"

scp "$TAR_FOLDER" "deploy@23.88.116.111:/home/deploy/projects/mobiledev-build/$TAR_FOLDER"

echo "tar.gz successfully copied to server."

ssh deploy@23.88.116.111 'cd projects/mobiledev-build; tar -xvf $TAR_FOLDER; pm2 delete dev; pm2 serve web-build 4000 --name "dev"'
