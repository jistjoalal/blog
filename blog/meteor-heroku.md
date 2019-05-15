---
title: "Deploy Meteor to Heroku"
date: "2019-05-15T02:30:41.109Z"
---

A Meteor app is just a node.js app. By using a [buildpack](https://github.com/AdmitHub/meteor-buildpack-horse), we can deploy with almost zero configuration.

## 1. Create heroku app

```bash
# (in project directory)
heroku login  # if not already
heroku create appname
```

## 2. Configure deployment settings

```bash
# set the buildpack
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git

# set node version
meteor node -v  # copy
```

```yml
# package.json:
"engines": {
  "node": "8.11.4"  # paste
}
```

```bash
# connect mlab DB addon (free tier)
heroku addons:create mongolab:sandbox

# set root url
heroku config:set ROOT_URL="https://appname.herokuapp.com"

# NOTE: no '/' at the end of url
```

## 3. Deploy

```bash
# (make changes)
git add, commit, push

# deploy
git push heroku master
```
