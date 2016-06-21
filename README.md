# YouTube Thumbnail Generator

A fully client-sided tool for creating clean looking youtube thumbnails.

## Develop

To make changes to the tool - you need to clone the repo and then run `npm install` and `bower install` commands to get all the required modules. 

Also, you need to install gulp globally, which handles the bundling. This can be done with `npm install --global gulp-cli` command.

After that just fire up gulp with `gulp default` and launch dev server with `npm run watch`

## Build

Because the tool is client sided - you can deploy it as a static page pretty easily. Simply copy run `gulp build` and when it's done - copy your `public` folder into `_build` subdirectory. Then change the title and meta tags inside `index.html` to your liking and you're done! Simply upload the contents of `_build` directory to your webserver and open it up.

## Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)