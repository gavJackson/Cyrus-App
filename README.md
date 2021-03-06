# CYRUS-App

CYRUS is a Windows and OSX desktop app built using Electron and VueJS.  It's is a productivity tool and provides quick and easy access to snippets and templates which you can paste into any application.  CYRUS can be controlled entirely by keyboard and can be used to provide you with easy access to simple snippets or for more complex templates with placeholder replacements. All of this ends up in your clip board, ready to paste into any application.


Watch an intro video about CYRUS on YouTube:

[![Intro video](https://img.youtube.com/vi/Mf8PFIL-4cQ/0.jpg)](https://www.youtube.com/watch?v=Mf8PFIL-4cQ)

### Releases

[BETA release (Windows and OSX installers)](https://github.com/gavJackson/Cyrus-App/releases/tag/0.1.41-closedBETA)


#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production (USE THIS ONE!!)

npm run build:all

# this incremements the build number in package.json and builds both osx and win versions

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[4c6ee7b](https://github.com/SimulatedGREG/electron-vue/tree/4c6ee7bf4f9b4aa647a22ec1c1ca29c2e59c3645) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

---

### Cross browser / device testing:

Provided by: 

[![Browserstack](/site/images/Browserstack-logo@2x.png)](http://www.BrowserStack.com)



