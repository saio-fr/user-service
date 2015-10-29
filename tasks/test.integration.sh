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
docker run -d -P \
	--name user-db \
	memsql/quickstart;
sleep 20;

echo "creating databases...";
# docker exec doest not work in circle ci.
# docker exec -d customer-db memsql-shell -e \
# "create database customer;";
docker run --rm \
	--name user-mysql-client \
	--link user-db:db \
	mysql sh -c \
	'mysql -h "$DB_PORT_3306_TCP_ADDR" -u root \
	--execute="create database user;
		create database authorizer"';
sleep 20;


echo "starting crossbar...";
docker run -d \
  --name user-crossbar \
  eu.gcr.io/saio-fr/crossbar:master;
sleep 20;

echo "starting authorizer service...";
docker run -d \
  --name user-authorizer \
  --link user-db:db \
  --link user-crossbar:crossbar \
  eu.gcr.io/saio-fr/authorizer:master;
sleep 20;

echo "starting user service...";
docker run -d \
  --name user-service \
  --link user-db:db \
  --link user-crossbar:crossbar \
  user-service;
sleep 20;

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
