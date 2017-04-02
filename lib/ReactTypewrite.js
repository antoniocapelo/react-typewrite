'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

/**
Props:
    * timeout {Number} - time (ms) between key strikes (it can be the exact time,
    * if randomize is disabled, or the maximum time, if randomize = true
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * eraseDelay {Number} - time (ms) before starting to clean up (default: 1000ms)
    * eraseSpeed  {Number} - time (ms) between removing each letter (default: 100ms)
    * initialDelay {Number} - time (ms) before starting to type the first word (default: 0ms)
    * randomize {Boolean} - wether the keystroke times should be randomize up to a defined
    * value or not (default: false)
    * cleanUp {Boolean} wether the strings should be cleaned after typing them (default: false)
    * hardBlink {Boolean} cursor blinking in hard mode - no animation (default: false)
 **/

function calculateRandomTimeouts(textToType, timeout) {
  var randomArray = [];

  for (var i = 0; i < textToType.length; i += 1) {
    var random = Math.ceil(Math.random() * timeout);
    var minimumRandom = random > 150 ? random : 150;
    randomArray.push(minimumRandom);
  }

  return randomArray;
}

var hardBlinkCssClass = 'react-typewrite-cursor-blink hard';
var regularBlinkCssClass = 'react-typewrite-cursor-blink';

var ReactTypewrite = (function (_React$PureComponent) {
  _inherits(ReactTypewrite, _React$PureComponent);

  function ReactTypewrite(props) {
    _classCallCheck(this, ReactTypewrite);

    _get(Object.getPrototypeOf(ReactTypewrite.prototype), 'constructor', this).call(this, props);
    var randoms = [];
    var textToType = props.children && props.children.props.children ? props.children.props.children : '';

    // getting randomized timeouts array
    if (props.randomize) {
      randoms = calculateRandomTimeouts(textToType, props.timeout);
    }

    this.state = {
      total: textToType.length,
      base: textToType,
      current: 0,
      randoms: randoms,
      cleaning: false,
      textToType: textToType,
      delay: props.initialDelay,
      justStarted: true,
      mounted: false
    };

    this.updateTimeout = null;
    this.cursorClassName = props.hardBlink ? hardBlinkCssClass : regularBlinkCssClass;
  }

  _createClass(ReactTypewrite, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ mounted: true }); // eslint-disable-line react/no-did-mount-set-state
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.children !== this.props.children) {
        clearTimeout(this.updateTimeout);

        var randoms = [];
        var textToType = nextProps.children && nextProps.children.props.children ? nextProps.children.props.children : '';

        // getting randomized timeouts array
        if (nextProps.randomize) {
          randoms = calculateRandomTimeouts(textToType, nextProps.timeout);
        }

        this.setState({
          total: textToType.length,
          base: textToType,
          current: 0,
          randoms: randoms,
          cleaning: false,
          textToType: textToType,
          delay: nextProps.initialDelay,
          justStarted: true
        });

        this.updateTimeout = null;
        this.cursorClassName = nextProps.hardBlink ? hardBlinkCssClass : regularBlinkCssClass;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this.isReady()) {
        this.getNextState();
      } else {
        this.props.onFinish();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.updateTimeout);
    }
  }, {
    key: 'getNextState',
    value: function getNextState() {
      var _this = this;

      if (!this.state.mounted) {
        return;
      }

      var baseString = this.state.base;
      var justStarted = false;

      // get current print direction (writing or erasing)
      var isCleaning = this.state.cleaning && this.state.current > 0 || this.stringAtEnd() && this.props.cleanUp;

      // get next char index
      var current = undefined;

      if (isCleaning) {
        current = this.stringAtBegining() ? 0 : this.state.current - 1;
      } else {
        current = this.state.current + 1;
      }

      var delay = undefined;

      if (this.state.delay) {
        delay = this.state.delay;
      } else {
        delay = this.stringAtBegining() || this.stringAtEnd() ? this.props.eraseDelay : undefined;
      }

      // next timeout
      // it can be the delay (on first char typed) --> state.delay
      // if typing, get the timeout --> getTimeout()
      // if cleaning, use 100 as default value
      var timeout = delay;

      if (!timeout) {
        timeout = isCleaning ? this.props.eraseSpeed : this.getTimeout();
      }

      this.updateTimeout = setTimeout(function () {
        return _this.setState({
          total: baseString.length,
          base: baseString,
          current: current,
          cleaning: isCleaning,
          justStarted: justStarted,
          delay: undefined
        });
      }, timeout);
    }

    // Utility functions
  }, {
    key: 'getTimeout',
    value: function getTimeout() {
      return this.props.randomize ? this.state.randoms[this.state.current] : this.props.timeout;
    }
  }, {
    key: 'stringAtEnd',
    value: function stringAtEnd() {
      var idx = arguments.length <= 0 || arguments[0] === undefined ? this.state.current : arguments[0];

      return idx === this.state.total;
    }
  }, {
    key: 'stringAtBegining',
    value: function stringAtBegining() {
      var idx = arguments.length <= 0 || arguments[0] === undefined ? this.state.current : arguments[0];

      return idx === 0 && !this.state.justStarted;
    }
  }, {
    key: 'isReady',
    value: function isReady() {
      // it's ready if no cleanUp is required and state.current > total
      // or if the cleanUp isrequired and current === 0 and already printed something
      if (this.props.cleanUp) {
        return this.stringAtBegining();
      }

      // if no cleanup, check if the current string is at the end and
      // if we're on the last string of the array
      return this.stringAtEnd();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.children) {
        return null;
      }

      var isReady = this.isReady();
      var newStr = this.state.base.substring(0, this.state.current);

      if (!isReady) {
        // this.getNextState();
      }

      var newEl = _react2['default'].cloneElement(this.props.children, {}, newStr, _react2['default'].createElement(
        'span',
        { className: isReady ? this.cursorClassName : '' },
        '|'
      )); // eslint-disable-line react/jsx-filename-extension

      return newEl;
    }
  }]);

  return ReactTypewrite;
})(_react2['default'].PureComponent);

ReactTypewrite.DEFAULT_ERASE_SPEED = 100;
ReactTypewrite.DEFAULT_TIMEOUT = 500;
ReactTypewrite.DEFAULT_INITIAL_DELAY = 0;
ReactTypewrite.DEFAULT_ERASE_DELAY = 1000;

ReactTypewrite.defaultProps = {
  timeout: ReactTypewrite.DEFAULT_TIMEOUT,
  initialDelay: ReactTypewrite.DEFAULT_INITIAL_DELAY,
  eraseDelay: ReactTypewrite.DEFAULT_ERASE_DELAY,
  eraseSpeed: ReactTypewrite.DEFAULT_ERASE_SPEED,
  randomize: false,
  cleanUp: false,
  hardBlink: false,
  onFinish: function onFinish() {}
};

ReactTypewrite.propTypes = {
  timeout: _react2['default'].PropTypes.number,
  initialDelay: _react2['default'].PropTypes.number,
  eraseDelay: _react2['default'].PropTypes.number,
  eraseSpeed: _react2['default'].PropTypes.number,
  randomize: _react2['default'].PropTypes.bool,
  cleanUp: _react2['default'].PropTypes.bool,
  hardBlink: _react2['default'].PropTypes.bool,
  children: _react2['default'].PropTypes.element.isRequired,
  onFinish: _react2['default'].PropTypes.func
};

module.exports = ReactTypewrite;