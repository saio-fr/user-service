#!/bin/env bash

# stop
docker stop user-test;
docker stop user-service;
docker stop user-crossbar;
docker stop user-authorizer;
docker stop user-db;

# clean
docker rm user-test;
docker rm user-service;
docker rm user-crossbar;
docker rm user-authorizer;
docker rm user-db;

# uninstall
docker rmi user-test;
docker rmi user-service;
docker rmi user-crossbar;
docker rmi user-authorizer;
