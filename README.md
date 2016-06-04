# react-typewrite

ReactJS component that simulates the effect of typing on a text editor


## Demo & Examples

Live demo: [antoniocapelo.github.io/react-typewrite](http://antoniocapelo.github.io/react-typewrite/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-typewrite is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-typewrite.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

Just require the component and use it on your ReactJS app.
Don't forget to include the component stylesheet, either ``lib/ReactTypewrite.css`` (if installed from NPM) or ``build/react-typewrite.min.css`` (if installed from Bower). How you'll include the component style - either by requiring it, including directly on the html, importing it - is up to you, just make sure you're using it so that the cursor can blink.

```
npm install react-typewrite --save
```


## Usage

```
var ReactTypewrite = require('react-typewrite');

<ReactTypewrite>Example</ReactTypewrite>
```

### Properties

* **text** {String || [String]} - text to type, it can be a single string or an array of strigns
* **randomize** {Boolean} - wether the keystroke times should be randomize up to a defined value or not (default: false)
* **timeout** {Number} - time (ms) between key strikes (it can be the exact time, if randomize is disabled, or the maximum time, if randomize = true
* **initialDelay** {Number} - time (ms) before starting to type the first word (default: 0ms)
* **betweenDelay** {Number} - time (ms) took between strings if an array is passed as text prop (default: 100ms)
* **cleanUp** {Boolean} wether the strings should be cleaned after typing them (default: false)


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## Contributing

``npm install && npm start `` for starting the server with the demo page.

## License

MIT

Copyright (c) 2016 António Capelo.

