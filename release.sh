#!/usr/bin/env bash

set -e

git pull -r origin master

yarn install
yarn test

git push origin master

