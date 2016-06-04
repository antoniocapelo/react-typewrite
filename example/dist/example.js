require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTypewrite = require('react-typewrite');

var App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
        return {
            text: ['sample text'],
            timeout: 500,
            randomize: true,
            hardBlink: false
        };
    },
    onTextChange: function onTextChange(ev) {
        this.setState({ text: ev.target.value });
    },
    onBlinkChange: function onBlinkChange(ev) {
        this.setState({ hardBlink: ev.target.checked });
    },
    onRandomizeChange: function onRandomizeChange(ev) {
        this.setState({ randomize: ev.target.checked });
    },
    onTimeoutChange: function onTimeoutChange(ev) {
        this.setState({ timeout: +ev.target.value });
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'controls' },
                React.createElement(
                    'div',
                    { className: 'control' },
                    React.createElement(
                        'label',
                        { htmlFor: 'text-to-input' },
                        'Text to input'
                    ),
                    React.createElement('input', { type: 'text', name: '', id: 'text-to-input', value: this.state.text, onChange: this.onTextChange })
                ),
                React.createElement(
                    'div',
                    { className: 'control' },
                    React.createElement(
                        'label',
                        { htmlFor: 'timeout' },
                        'Typing Timeout'
                    ),
                    React.createElement('input', { type: 'text', name: '', id: 'timeout', value: this.state.timeout, onChange: this.onTimeoutChange })
                ),
                React.createElement(
                    'div',
                    { className: 'control' },
                    React.createElement(
                        'label',
                        { htmlFor: 'randomize' },
                        'Randomize stroke timing'
                    ),
                    React.createElement('input', { type: 'checkbox', name: '', id: 'randomize', value: this.state.randomize, onChange: this.onRandomizeChange })
                ),
                React.createElement(
                    'div',
                    { className: 'control' },
                    React.createElement(
                        'label',
                        { htmlFor: 'hard' },
                        'Hard Blink'
                    ),
                    React.createElement('input', { type: 'checkbox', name: '', id: 'hard', value: this.state.hardBlink, onChange: this.onBlinkChange })
                )
            ),
            React.createElement(ReactTypewrite, { key: JSON.stringify(this.state), text: this.state.text, timeout: this.state.timeout, randomize: this.state.randomize, betweenDelay: 200, hardBlink: this.state.hardBlink })
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

},{"react":undefined,"react-dom":undefined,"react-typewrite":undefined}]},{},[1]);
