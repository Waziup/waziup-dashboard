
version=V4_PREREL
echo "Commit the code with the tag ${version}"
git tag ${version}
git commit -a
git push

yarn run build -- --release
sleep 3
docker build -t waziup/waziup-dashboard .
sleep 3
docker tag waziup/waziup-dashboard waziup/waziup-dashboard:${version}
docker images
sleep 3
docker push waziup/waziup-dashboard:${version}

echo "CHANGE k8s config file accordingly for image name."

echo "Doing a local test with the image: after testing kill the container with {docker kill containerID}"
docker run -p 4000:3000 waziup/waziup-dashboard:${version}
