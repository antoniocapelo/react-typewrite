import React from 'react';

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
  const randomArray = [];

  for (let i = 0; i < textToType.length; i += 1) {
    const random = Math.ceil(Math.random() * timeout);
    const minimumRandom = random > 150 ? random : 150;
    randomArray.push(minimumRandom);
  }

  return randomArray;
}

const hardBlinkCssClass = 'react-typewrite-cursor-blink hard';
const regularBlinkCssClass = 'react-typewrite-cursor-blink';

class ReactTypewrite extends React.PureComponent {
  constructor(props) {
    super(props);
    let randoms = [];
    const textToType = (props.children && props.children.props.children) ? props.children.props.children : '';

    // getting randomized timeouts array
    if (props.randomize) {
      randoms = calculateRandomTimeouts(textToType, props.timeout);
    }

    this.state = {
      total: textToType.length,
      base: textToType,
      current: 0,
      randoms,
      cleaning: false,
      textToType,
      delay: props.initialDelay,
      justStarted: true,
      mounted: false,
    };

    this.updateTimeout = null;
    this.cursorClassName = props.hardBlink ? hardBlinkCssClass : regularBlinkCssClass;
  }

  componentDidMount() {
    this.setState({ mounted: true }); // eslint-disable-line react/no-did-mount-set-state
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      clearTimeout(this.updateTimeout);

      let randoms = [];
      const textToType = (nextProps.children && nextProps.children.props.children) ? nextProps.children.props.children : '';

      // getting randomized timeouts array
      if (nextProps.randomize) {
        randoms = calculateRandomTimeouts(textToType, nextProps.timeout);
      }

      this.setState({
        total: textToType.length,
        base: textToType,
        current: 0,
        randoms,
        cleaning: false,
        textToType,
        delay: nextProps.initialDelay,
        justStarted: true,
      });

      this.updateTimeout = null;
      this.cursorClassName = nextProps.hardBlink ? hardBlinkCssClass : regularBlinkCssClass;
    }
  }

  componentDidUpdate() {
    if (!this.isReady()) {
      this.getNextState();
    } else {
      this.props.onFinish();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeout);
  }

  getNextState() {
    if (!this.state.mounted) {
      return;
    }

    const baseString = this.state.base;
    const justStarted = false;

    // get current print direction (writing or erasing)
    const isCleaning = (this.state.cleaning && this.state.current > 0) ||
      (this.stringAtEnd() && this.props.cleanUp);

    // get next char index
    let current;

    if (isCleaning) {
      current = this.stringAtBegining() ? 0 : this.state.current - 1;
    } else {
      current = this.state.current + 1;
    }

    let delay;

    if (this.state.delay) {
      delay = this.state.delay;
    } else {
      delay = (this.stringAtBegining() || this.stringAtEnd()) ? this.props.eraseDelay : undefined;
    }

    // next timeout
    // it can be the delay (on first char typed) --> state.delay
    // if typing, get the timeout --> getTimeout()
    // if cleaning, use 100 as default value
    let timeout = delay;

    if (!timeout) {
      timeout = isCleaning ? this.props.eraseSpeed : this.getTimeout();
    }

    this.updateTimeout = setTimeout(() => (
      this.setState({
        total: baseString.length,
        base: baseString,
        current,
        cleaning: isCleaning,
        justStarted,
        delay: undefined,
      })
    ), timeout);
  }

  // Utility functions
  getTimeout() {
    return this.props.randomize ? this.state.randoms[this.state.current] : this.props.timeout;
  }

  stringAtEnd(idx = this.state.current) {
    return idx === this.state.total;
  }

  stringAtBegining(idx = this.state.current) {
    return idx === 0 && !this.state.justStarted;
  }

  isReady() {
    // it's ready if no cleanUp is required and state.current > total
    // or if the cleanUp isrequired and current === 0 and already printed something
    if (this.props.cleanUp) {
      return this.stringAtBegining();
    }

    // if no cleanup, check if the current string is at the end and
    // if we're on the last string of the array
    return this.stringAtEnd();
  }

  render() {
    if (!this.props.children) {
      return null;
    }

    const isReady = this.isReady();
    const newStr = this.state.base.substring(0, this.state.current);

    if (!isReady) {
      // this.getNextState();
    }

    const newEl = React.cloneElement(this.props.children, {}, newStr, <span className={isReady ? this.cursorClassName : ''}>|</span>); // eslint-disable-line react/jsx-filename-extension

    return (
      <div className={'type-container'}>
        { newEl }
      </div>
    );
  }

}

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
  onFinish: () => {},
};

ReactTypewrite.propTypes = {
  timeout: React.PropTypes.number,
  initialDelay: React.PropTypes.number,
  eraseDelay: React.PropTypes.number,
  eraseSpeed: React.PropTypes.number,
  randomize: React.PropTypes.bool,
  cleanUp: React.PropTypes.bool,
  hardBlink: React.PropTypes.bool,
  children: React.PropTypes.element.isRequired,
  onFinish: React.PropTypes.func,
};

module.exports = ReactTypewrite;
