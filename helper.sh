#!/bin/bash

key="$1"
case $key in
    -i | --install)
        npm install
        npm i -g serverless
        cd ../companion-worker && npm install
        cd ../companion-bridge && npm install
    ;;
    -r | --run)
        yarn start:local &
        P1=$!
        cd ../companion-worker && serverless offline --stage=local &
        P2=$!
        cd ../companion-bridge && serverless offline --stage=local &
        P3=$!
        wait $P1 $P2 $P3
    ;;
esac