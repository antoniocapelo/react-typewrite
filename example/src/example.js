var React = require('react');
var ReactDOM = require('react-dom');
var ReactTypewrite = require('react-typewrite');

var App = React.createClass({
    getInitialState() {
        return {
            text: ['sample text'],
            timeout: 500,
            randomize: true,
            hardBlink: false
        };
    },
    onTextChange(ev) {
        this.setState({text: ev.target.value});
    },
    onBlinkChange(ev) {
        this.setState({hardBlink: ev.target.checked});
    },
    onRandomizeChange(ev) {
        this.setState({randomize: ev.target.checked});
    },
    onTimeoutChange(ev) {
        this.setState({timeout: + ev.target.value});
    },
    render () {
        return (
            <div>
                <div className="controls">
                    <div className="control">
                        <label htmlFor="text-to-input">Text to input</label>
                        <input type="text" name="" id="text-to-input" value={this.state.text} onChange={this.onTextChange} />
                    </div>
                    <div className="control">
                        <label htmlFor="timeout">Typing Timeout</label>
                        <input type="text" name="" id="timeout" value={this.state.timeout} onChange={this.onTimeoutChange} />
                    </div>
                    <div className="control">
                        <label htmlFor="randomize">Randomize stroke timing</label>
                        <input type="checkbox" name="" id="randomize" value={this.state.randomize} onChange={this.onRandomizeChange} />
                    </div>
                    <div className="control">
                        <label htmlFor="hard">Hard Blink</label>
                        <input type="checkbox" name="" id="hard" value={this.state.hardBlink} onChange={this.onBlinkChange} />
                    </div>
                </div>
                <ReactTypewrite key={JSON.stringify(this.state)} text={this.state.text} timeout={this.state.timeout} randomize={this.state.randomize}  betweenDelay={200} hardBlink={this.state.hardBlink}/>
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('app'));