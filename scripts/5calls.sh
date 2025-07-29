#!/usr/bin/env bash

. .env

ADDRESS="41 Union St.;Boston, MA 02108"

if [ $# -gt 0 ]
then
    ADDRESS=$1
fi

echo "Looking up: " $ADDRESS

ENCODED=$(echo $ADDRESS | sed -e "s/ /%20/g;s/;/%3B/g;s/,/%2C/g")
curl -G https://api.5calls.org/v1/representatives?location=${ENCODED} \
  -H "X-5Calls-Token: ${FIVECALLS_API}" | python -m json.tool