#!/bin/env bash

# pull images
gcloud docker pull eu.gcr.io/saio-fr/crossbar:master
gcloud docker pull eu.gcr.io/saio-fr/authorizer:master
gcloud docker pull eu.gcr.io/saio-fr/user:master

# install
docker build -t user-service -f Dockerfile .;
docker build -t user-test -f tasks/integration/Dockerfile .;

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
  eu.gcr.io/saio-fr/crossbar:master;
sleep 4;

echo "starting authorizer service...";
docker run -d \
  --name user-authorizer \
  --link user-db:db \
  --link user-crossbar:crossbar \
  eu.gcr.io/saio-fr/authorizer:master;
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
