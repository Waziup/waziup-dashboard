
version=V1_REL_elsQuery
git tag ${version}
git commit -a
git push
yarn run build -- --release
sleep 3
docker build -t waziup/watersense-dashboard .
sleep 3
docker tag waziup/watersense-dashboard waziup/watersense-dashboard:${version}
docker images
sleep 3
docker push waziup/watersense-dashboard:${version}

echo "CHANGE k8s config file accordingly for image name."
