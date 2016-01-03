import './global-styles/main.css';
import React from 'react';
import App from './components/AppComponent/App.jsx';
import './main.css';

main();

function main() {
    const app = document.createElement('div');
    app.style.height="100%"
    //document.body.style.background = 'black';
    document.body.appendChild(app);
    React.render(<App />, app);
}
