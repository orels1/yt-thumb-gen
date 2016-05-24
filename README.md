# react-alt-boilerplate

The basic setup for your react app.

## Start development

To begin creating your app just fork clone the repo (or even better - fork it).

You will need nodejs 4.4.2 (or higher) and npm. All of that can be installed from [here](http://nodejs.org)

After cloning - open the directory and run `npm install`, it will get all the needed dependencies.

After the installation copletion - run `bower install`, that one should be pretty fast

You might need to install gulp globally. Run `npm install --global gulp-cli`

To start up a little dev server - run `gulp default` and `npm run watch`

This will launch a webserver on [localhost:5000](http://localhost:5000) and will watch for all the changes.

## Project structure

.
├── app (Main React folder with sources)
|	├── actions (All the React actions are stored here)
|	|	├── HomeActions.js
|	|	└── NavbarActions.js
|	├── components (All the React components are stored here)
|	|	├── App.js
|	|	├── Home.js
|	|	└── Navbar.js
|	├── stores (All the React stores should be placed here)
|	|	├── HomeStore.js
|	|	└── NavbarStore.js
|	├── stylesheets (Stylesheets, sass file in this case, is placed here for ease of compilation)
|	|	└── main.sass
|	├── alt.js
|	├── main.js
|	└── routes.js (Main routing file)
|
├── public (All the compiled files are stored here)
|	├── css
|	├── fonts (Contains glyphicon fonts)
|	├── img
|	|	└── bg.jpg
|	└── js
├── views (Contains the only swig view, since our pages are rendered by react)
|	└── index.html
├── .gitignore
├── bower.json (Bower package file)
├── gulpfile.js (Gulp build file)
├── package.json (Npm package file. You can set your app's name and repo there)
├── README.MD
└── server.js (Dev node.js server)

## Usage

The basics, if you don't change anything, are the following:

- All the pages will contain navbar and all the contents will be inside a `container` class, which will make them somewhat centered in a big block. I use twitter bootstrap everywhere.
- You can add new components and insert them into router to render on separate pages, or into the `Home` component, to show them on the mainpage
- To navigate - use `<Link />` component, or it will break the routing. You can import link from `react-router`, check existing components for examples.
- To get data fro your api endpoints - use `$.ajax()` inside the actions and call them inside `componentDidMount` of your component to load data on build.

I strongly recommend visiting [React's project page](https://facebook.github.io/react/docs) for more info on react itself and it's component's structure.