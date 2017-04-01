'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
Props:
    * text {String || [String]} - text to type, it can be a single string or an array of strigns
    * randomize {Boolean} - wether the keystroke times should be randomize up to a defined value or not (default: false)
    * timeout {Number} - time (ms) between key strikes (it can be the exact time, if randomize is disabled, or the maximum time, if randomize = true
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * betweenDelay {Number} - time (ms) took between strings if an array is passed as text prop (default: 100ms)
    * cleanUp {Boolean} wether the strings should be cleaned after typing them (default: false)
    * hardBlink {Boolean} cursor blinking in hard mode - no animation (default: false)
 **/

function calculateRandomTimeouts(textsToType, timeout) {
    var randomArray = [];
    var biggestStringLength = _lodash2['default'].reduce(textsToType, function (biggestLen, arr) {
        return biggestLen > arr.length ? biggestLen : arr.length;
    }, 0);

    for (var i = 0; i < biggestStringLength; i++) {
        var random = Math.ceil(Math.random() * timeout);
        var minimumRandom = random > 150 ? random : 150;
        randomArray.push(minimumRandom);
    }

    return randomArray;
}

var ReactTypewrite = (function (_React$Component) {
    _inherits(ReactTypewrite, _React$Component);

    function ReactTypewrite(props) {
        _classCallCheck(this, ReactTypewrite);

        _get(Object.getPrototypeOf(ReactTypewrite.prototype), 'constructor', this).call(this, props);
        var randoms = [];
        var textsToType = this.props.children.props.children;

        // getting random array
        if (this.props.randomize) {
            randoms = calculateRandomTimeouts(textsToType, this.props.timeout);
        }

        this.state = {
            total: textsToType[0].length,
            base: textsToType[0],
            current: 0,
            randoms: randoms,
            cleaning: false,
            textIndex: 0,
            textsToType: textsToType,
            delay: this.props.initialDelay || 0,
            justStarted: true
        };

        console.log(this.state);

        this.mounted = false;
        this.cursorClassName = props.hardBlink ? 'react-typewrite-cursor-blink hard' : 'react-typewrite-cursor-blink';
    }

    _createClass(ReactTypewrite, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.mounted = true;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.mounted = false;
        }
    }, {
        key: 'render',
        value: function render() {
            var isReady = this.isReady();
            var baseStr = _lodash2['default'].take(this.state.textsToType, this.state.textIndex).join('');
            var newStr = this.state.base.substring(0, this.state.current);
            var toPrint = this.props.cleanUp ? newStr : baseStr + newStr;

            if (!isReady) {
                this.getNextState();
            }

            var newEl = _react2['default'].cloneElement(this.props.children, {}, toPrint, _react2['default'].createElement(
                'span',
                { className: isReady ? this.cursorClassName : '' },
                '|'
            ));

            return _react2['default'].createElement(
                'div',
                { className: 'type-container' },
                newEl
            );
        }
    }, {
        key: 'getNextState',
        value: function getNextState() {
            var baseString = this.state.base;
            var textIndex = this.state.textIndex;

            // get current print direction (writing or erasing)
            var isCleaning = this.state.cleaning && this.state.current > 0 || this.stringAtEnd() && this.props.cleanUp;

            // get next char index
            var current = isCleaning ? this.stringAtBegining() ? 0 : this.state.current - 1 : this.state.current + 1;

            var delay = undefined;
            var justStarted = false;
            if (this.state.delay) {
                delay = this.state.delay;
            } else {
                delay = this.stringAtBegining() || this.stringAtEnd() ? this.props.betweenDelay || ReactTypewrite.END_OF_STRING_DELAY : undefined;
            }

            // check if we should change string
            if (this.shouldUpdateTextIndex()) {
                textIndex = this.getNextTextIndex();
                baseString = this.state.textsToType[textIndex];
                isCleaning = false;
                current = 0;
                justStarted = true;
            }

            // next timeout
            // it can be the delay (on first char typed) --> state.delay
            // if typing, get the timeout --> getTimeout()
            // if cleaning, use 100 as default value
            var timeout = delay ? delay : isCleaning ? ReactTypewrite.ERASE_SPEED : this.getTimeout();

            window.setTimeout((function () {
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
    }, {
        key: 'getTimeout',
        value: function getTimeout() {
            return this.props.randomize ? this.state.randoms[this.state.current] : this.props.timeout;
        }
    }, {
        key: 'finishedCleaning',
        value: function finishedCleaning() {
            return this.props.cleanUp && this.stringAtBegining();
        }
    }, {
        key: 'shouldUpdateTextIndex',
        value: function shouldUpdateTextIndex() {
            return this.finishedCleaning() && this.thereAreMoreStringsLeft() || !this.props.cleanUp && this.stringAtEnd() && this.thereAreMoreStringsLeft();
        }
    }, {
        key: 'getNextTextIndex',
        value: function getNextTextIndex() {
            return this.state.textIndex + 1;
        }
    }, {
        key: 'stringAtEnd',
        value: function stringAtEnd(index) {
            var idx = index || this.state.current;
            return idx === this.state.total;
        }
    }, {
        key: 'stringAtBegining',
        value: function stringAtBegining(index) {
            var idx = index || this.state.current;
            return idx === 0 && !this.state.justStarted;
        }
    }, {
        key: 'thereAreMoreStringsLeft',
        value: function thereAreMoreStringsLeft() {
            return this.state.textIndex < this.state.textsToType.length - 1;
        }
    }, {
        key: 'isReady',
        value: function isReady(state) {
            // it's ready if no cleanUp is required and state.current > total
            // or if the cleanUp isrequired and current === 0 and already printed something
            //
            if (this.props.cleanUp) {
                return !this.thereAreMoreStringsLeft() && this.stringAtBegining();
            } else {
                // if no cleanup, check if the current string is at the end and
                // if we're on the last string of the array
                return !this.thereAreMoreStringsLeft() && this.stringAtEnd();
            }
            //return (this.props.cleanUp === false && this.state.current >= this.state.total) || !(this.state.current <= this.state.total);
        }
    }]);

    return ReactTypewrite;
})(_react2['default'].Component);

ReactTypewrite.ERASE_SPEED = 100;
ReactTypewrite.DEFAULT_TIMEOUT = 500;
ReactTypewrite.END_OF_STRING_DELAY = 100;

ReactTypewrite.defaultProps = {
    timeout: ReactTypewrite.DEFAULT_TIMEOUT
};

ReactTypewrite.propTypes = {
    text: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string)]).isRequired,
    timeout: _react2['default'].PropTypes.number,
    randomize: _react2['default'].PropTypes.bool,
    initialDelay: _react2['default'].PropTypes.number,
    betweenDelay: _react2['default'].PropTypes.number,
    cleanUp: _react2['default'].PropTypes.bool
};

module.exports = ReactTypewrite;