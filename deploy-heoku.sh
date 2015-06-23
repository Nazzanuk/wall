#!/bin/bash
git add .
git commit -m ":D"
git push heroku master
heroku ps:scale web=1
heroku restart
heroku open