#!/bin/env bash

# install
docker build -t user-crossbar -f tasks/integration/dockerfiles/crossbarDockerfile .;
docker build -t user-service -f tasks/integration/dockerfiles/userDockerfile .;
docker build -t user-test -f tasks/integration/dockerfiles/testDockerfile .;

# start services
echo "starting database...";
docker run -d \
	--name user-db \
	-e POSTGRES_PASSWORD=test \
	postgres;
sleep 4;

echo "starting crossbar...";
docker run -d \
  --name user-crossbar \
  user-crossbar;
sleep 4;

echo "starting user service...";
docker run -d \
  --name user-service \
  --link user-db:db \
  --link user-crossbar:crossbar \
  user-service;
sleep 4;

echo "running test...";
docker run \
  --name user-test \
  --link user-db:db \
  --link user-crossbar:crossbar \
  user-test;
TEST_EC=$?;

# return with the exit code of the test
if [ $TEST_EC -eq 0 ]
then
  echo "It Saul Goodman !";
  exit 0;
else
  exit $TEST_EC;
fi
