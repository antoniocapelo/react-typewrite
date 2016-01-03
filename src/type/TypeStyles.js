import Radium from 'radium';

let  blinkKeyFrame = Radium.keyframes({
  '0%': {opacity: '1'},
  '50%': {opacity: '0'},
  '100%': {opacity: '1'}
}, 'TypeWriter');

let styles = {
    cursor: {
        animation: `${blinkKeyFrame} steps(1) 1s infinite`,
    }
};

export default styles;

