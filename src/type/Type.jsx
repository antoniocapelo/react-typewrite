import React from 'react';
import _ from 'lodash';
require('./TypeStyles.css')

/**
Props:
    * text {String || [String]} - text to type, it can be a single string or an array of strigns
    * randomize {Boolean} - wether the keystroke times should be randomize up to a defined value or not (default: false)
    * timeout {Number} - time (ms) between key strikes (it can be the exact time, if randomize is disabled, or the maximum time, if randomize = true
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * betweenDelay {Number} - time (ms) took between strings if an array is passed as text prop (default: 100ms)
    * cleanUp {Boolean} wether the strings should be cleaned after typing them (default: false)
 **/


class TypeWriter extends React.Component {
    constructor(props) {
        super(props);
        let randoms = [];
        let textsToType = _.isArray(this.props.text) ? this.props.text : [this.props.text];

        // getting random array
        if (this.props.randomize) {
            this.calculateRandomTimeouts(randoms, textsToType);
        }

        this.state = {
            total: textsToType[0].length-1,
            base: textsToType[0],
            current: 0,
            randoms: randoms,
            cleaning: false,
            textIndex: 0,
            textsToType: textsToType,
            delay: this.props.initialDelay || 0,
            justStarted: true
        };
    }
    render() {
        const CURSOR_CLASS_NAME = 'react-typewrite-cursor-blink';
        const isReady = this.ready();
        const baseStr = _.take(this.state.textsToType, this.state.textIndex).join('');
        const newStr = this.state.base.substring(0, this.state.current);
        const toPrint = this.props.cleanUp? newStr : baseStr + newStr;
        if (!isReady) {
            this.getNextState();
        }
        return (
            <div className={'type-container'}>
                <p>
                    {toPrint}
                    <span className={isReady? CURSOR_CLASS_NAME: ''}>|</span>
                </p>
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
            delay = (this.stringAtBegining() || this.stringAtEnd()) ? this.props.betweenDelay || TypeWriter.END_OF_STRING_DELAY : undefined;
        }

        // check if we should change string 
        if (this.shouldUpdateTextIndex()) {
            textIndex  = this.getNextTextIndex();
            baseString = this.state.textsToType[textIndex];
            isCleaning = false;
            current = 0;
            justStarted = true;
        }


        // next timeout
        // it can be the delay (on first char typed) --> state.delay
        // if typing, get the timeout --> getTimeout()
        // if cleaning, use 100 as default value
        let timeout = delay ?  delay : (isCleaning ? TypeWriter.ERASE_SPEED : this.getTimeout());

        window.setTimeout((function() {
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
        }).bind(this), timeout);
    }
    // Utility functions
    calculateRandomTimeouts(randomArray, textsToType) {
        let biggestStringLength = _.reduce(textsToType, function(biggestLen, arr) {
            return biggestLen > arr.length ? biggestLen : arr.length;
        }, 0);
        for (let i = 0 ; i < biggestStringLength; i ++) {
            let random = Math.ceil(Math.random() * (this.props.timeout));
            let minimumRandom = random > 150 ? random : 150;
            randomArray.push(minimumRandom);
        }
    }
    getTimeout() {
        return this.props.randomize ? this.state.randoms[this.state.current] : this.props.timeout;
    }
    finishedCleaning() {
        return this.props.cleanUp && this.stringAtBegining();
    }
    shouldUpdateTextIndex() {
        return (this.finishedCleaning() && this.thereAreMoreStringsLeft()) ||
            (!this.props.cleanUp && this.stringAtEnd() && this.thereAreMoreStringsLeft());
    }
    getNextTextIndex() {
        debugger;
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
    thereAreMoreStringsLeft() {
        return this.state.textIndex < (this.state.textsToType.length -1);
    }
    ready(state) {
        // it's ready if no cleanUp is required and state.current > total
        // or if the cleanUp isrequired and current === 0 and already printed something
        //
        if (this.props.cleanUp) {
            return !this.thereAreMoreStringsLeft() && this.stringAtBegining();
        } else {
            // if no cleanup, check if the current string is at the end and
            // if we're on the last string of the array
            debugger;
            return !this.thereAreMoreStringsLeft() && this.stringAtEnd();
        }
        //return (this.props.cleanUp === false && this.state.current >= this.state.total) || !(this.state.current <= this.state.total); 
    }
}

TypeWriter.ERASE_SPEED         = 100;
TypeWriter.END_OF_STRING_DELAY = 100;

TypeWriter.propTypes = {
    text: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.arrayOf(React.PropTypes.string)
    ]).isRequired,
    timeout:   React.PropTypes.number.isRequired,
    randomize:  React.PropTypes.bool,
    initialDelay: React.PropTypes.number,
    betweenDelay: React.PropTypes.number,
    cleanUp: React.PropTypes.bool,
}

module.exports = TypeWriter;
