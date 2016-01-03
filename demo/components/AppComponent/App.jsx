import React from 'react';
import Type from '../../../src/type/Type.jsx'
let styles = require('./AppStyles.js');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false
        };
    }
    render() {
        return (
            <div className="app" style={styles.base}>
                <h1>React typewriter demo</h1>
                <p style={styles.labels}>timeout: 400 | randomized | init delay: 2000 | betweenDelay: 1000 | no clean up</p>
                <Type text={['yo']} timeout={400} randomize={true} initialDelay={2000} betweenDelay={1000}/>
                <p style={styles.labels}>timeout: 400 | randomized | init delay: 2000 | betweenDelay: 1000 | no clean up</p>
                <Type text={['one thing', ', two things', ' and more...']} timeout={400} randomize={true} initialDelay={2000} betweenDelay={1000} cleanUp={false}/>
                <p style={styles.labels}>timeout: 100 | randomized | init delay: 1000 | betweenDelay: 1000 | with clean up</p>
                <Type text={['yoyo', 'dope', 'word']} timeout={100} randomize={true} initialDelay={1000} betweenDelay={2000} cleanUp={true}/>
            </div>
        );
    }
}

module.exports = App;
