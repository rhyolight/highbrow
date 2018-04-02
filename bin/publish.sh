#!/usr/bin/env bash

tmp="/tmp"

npm run build

rm -rf "$tmp/lowbrow"
mkdir "$tmp/lowbrow"

cp out/* "$tmp/lowbrow/."

git checkout gh-pages

cp -r "$tmp/lowbrow" bin

git add bin

git commit -m "Publishing latest to gh-pages"
git push origin gh-pages

git checkout master
