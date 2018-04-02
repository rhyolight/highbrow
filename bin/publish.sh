#!/usr/bin/env bash

tmp="/tmp"

npm install .
npm run build

rm -rf "$tmp/lowbrow"
cp -r out "$tmp/lowbrow"

git checkout gh-pages

cp -r "$tmp/lowbrow" bin

git add bin

git commit -m "Publishing latest to gh-pages"
git push origin gh-pages

git checkout master
