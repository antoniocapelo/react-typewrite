# react-typewrite
## Description
ReactJS component that simulates the effect of typing on a text editor

## Installation

    npm install react-typewrite --save. 

## Usage
Just require the component and use it on your ReactJS app.
Don't forget to include the component stylesheet, located in ``build/react-typewrite.css``. How you'll include the component style - either by requiring it, including directly on the html, importing it - is up to you, just make sure you're using it so that the cursor can blink.

### Props

* **text** {String || [String]} - text to type, it can be a single string or an array of strigns
* **randomize** {Boolean} - wether the keystroke times should be randomize up to a defined value or not (default: false)
* **timeout** {Number} - time (ms) between key strikes (it can be the exact time, if randomize is disabled, or the maximum time, if randomize = true
* **initialDelay** {Number} - time (ms) before starting to type the first word (default: 0ms)
* **betweenDelay** {Number} - time (ms) took between strings if an array is passed as text prop (default: 100ms)
* **cleanUp** {Boolean} wether the strings should be cleaned after typing them (default: false)

### Usage example

    
      <Type text={['one thing', ', two things', ' and more...']}
        timeout={400}
        randomize={true}
        initialDelay={2000}
        betweenDelay={1000}
        cleanUp={false}
      />


## Contributing

``npm install && npm start `` for starting the webpack-dev-server with the demo page.


## License
MIT

