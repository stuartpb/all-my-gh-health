#!/usr/bin/env bash

node list-gh-cnames.js $1 $2 | while read domain; do
  ruby healthreason.rb "$domain"
done
