import React from 'react';
import _ from 'lodash';

/**
Props:
    * timeout {Number} - time (ms) between key strikes (it can be the exact time, if randomize is disabled, or the maximum time, if randomize = true
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * eraseDelay {Number} - time (ms) before starting to clean up (default: 1000ms)
    * eraseSpeed  {Number} - time (ms) between removing each letter (default: 100ms)
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * randomize {Boolean} - wether the keystroke times should be randomize up to a defined value or not (default: false)
    * cleanUp {Boolean} wether the strings should be cleaned after typing them (default: false)
    * hardBlink {Boolean} cursor blinking in hard mode - no animation (default: false)
 **/

function calculateRandomTimeouts(textsToType, timeout) {
    const randomArray = [];

    for (let i = 0 ; i < textsToType.length; i ++) {
        let random = Math.ceil(Math.random() * timeout);
        let minimumRandom = random > 150 ? random : 150;
        randomArray.push(minimumRandom);
    }

    return randomArray;
}


class ReactTypewrite extends React.Component {
    constructor(props) {
        if (!props.children) {
            console.warn('Warning: A single children must be provided to this component.')
            return;
        }

        super(props);
        let randoms = [];
        let textToType = this.props.children.props.children;

        // getting random array
        if (this.props.randomize) {
            randoms = calculateRandomTimeouts(textToType, this.props.timeout);
        }

        this.state = {
            total: textToType.length,
            base: textToType,
            current: 0,
            randoms: randoms,
            cleaning: false,
            textIndex: 0,
            textsToType: textToType,
            delay: this.props.initialDelay,
            justStarted: true
        };

        this.mounted = false;
        this.cursorClassName = props.hardBlink ? 'react-typewrite-cursor-blink hard' : 'react-typewrite-cursor-blink';
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const isReady = this.isReady();
        // const baseStr = _.take(this.state.textsToType, this.state.textIndex).join('');
        const newStr = this.state.base.substring(0, this.state.current);
        // const toPrint = this.props.cleanUp ? newStr : baseStr + newStr;

        if (!isReady) {
            this.getNextState();
        }

        const newEl = React.cloneElement(this.props.children, {}, newStr, <span className={isReady? this.cursorClassName: ''}>|</span>);

        return (
            <div className={'type-container'}>
                { newEl }
            </div>
        );
    }

    getNextState() {
        let baseString = this.state.base;
        let textIndex  = this.state.textIndex;

        // get current print direction (writing or erasing)
        let isCleaning = (this.state.cleaning && this.state.current > 0) || (this.stringAtEnd() && this.props.cleanUp);

        // get next char index
        let current = isCleaning ? (this.stringAtBegining() ? 0 : this.state.current - 1) : this.state.current + 1;

        let delay;
        let justStarted = false;
        if (this.state.delay) {
            delay = this.state.delay;
        } else {
            delay = (this.stringAtBegining() || this.stringAtEnd()) ? this.props.eraseDelay : undefined;
        }

        // check if we should change string 
        // if (this.shouldUpdateTextIndex()) {
            // textIndex  = this.getNextTextIndex();
            // baseString = this.state.textsToType[textIndex]DEFAULT_ERASE_DELAY
            // isCleaning = false;
            // current = 0;
            // justStarted = true;
        // }


        // next timeout
        // it can be the delay (on first char typed) --> state.delay
        // if typing, get the timeout --> getTimeout()
        // if cleaning, use 100 as default value
        let timeout = delay ?  delay : (isCleaning ? ReactTypewrite.DEFAULT_ERASE_SPEED : this.getTimeout());

        window.setTimeout((function() {
                if (this.mounted) {
                    this.setState({
                        total: baseString.length,
                        base: baseString,
                        current: current,
                        cleaning: isCleaning,
                        justStarted: justStarted,
                        delay: undefined,
                        textIndex: textIndex,
                        textsToType: this.state.textsToType
                    });
                }
        }).bind(this), timeout);
    }

    // Utility functions
    getTimeout() {
        return this.props.randomize ? this.state.randoms[this.state.current] : this.props.timeout;
    }

    // finishedCleaning() {
        // return this.props.cleanUp && this.stringAtBegining();
    // }

    // shouldUpdateTextIndex() {
        // return (this.finishedCleaning() || !this.props.cleanUp && this.stringAtEnd());
    // }

    getNextTextIndex() {
        return this.state.textIndex + 1;
    }

    stringAtEnd(index) {
        let idx = index || this.state.current;
        return idx === this.state.total; 
    }

    stringAtBegining(index) {
        let idx = index || this.state.current;
        return idx === 0 && !this.state.justStarted;
    }

    isReady(state) {
        // it's ready if no cleanUp is required and state.current > total
        // or if the cleanUp isrequired and current === 0 and already printed something
        if (this.props.cleanUp) {
            return this.stringAtBegining();
        } else {
            // if no cleanup, check if the current string is at the end and
            // if we're on the last string of the array
            this.stringAtEnd();
        }
    }
}

ReactTypewrite.DEFAULT_ERASE_SPEED      = 100;
ReactTypewrite.DEFAULT_TIMEOUT          = 500;
ReactTypewrite.DEFAULT_INITIAL_DELAY    = 0;
ReactTypewrite.DEFAULT_ERASE_DELAY      = 1000;

ReactTypewrite.defaultProps = {
    timeout: ReactTypewrite.DEFAULT_TIMEOUT,
    initialDelay: ReactTypewrite.DEFAULT_INITIAL_DELAY,
    eraseDelay: ReactTypewrite.DEFAULT_ERASE_DELAY,
    eraseSpeed: ReactTypewrite.DEFAULT_ERASE_SPEED,
};

ReactTypewrite.propTypes = {
    timeout:   React.PropTypes.number,
    initialDelay: React.PropTypes.number,
    eraseDelay: React.PropTypes.number,
    eraseSpeed: React.PropTypes.number,
    randomize:  React.PropTypes.bool,
    cleanUp: React.PropTypes.bool,
    hardBlink: React.PropTypes.bool,
    hardBlink: React.PropTypes.bool,
    children: React.PropTypes.element.isRequired,
}

module.exports = ReactTypewrite;