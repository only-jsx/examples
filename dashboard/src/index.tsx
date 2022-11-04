import './index.css';

import App, {AppProps} from './App';
import reportWebVitals from './reportWebVitals';

function render() {
    const root = document.getElementById('root');

    const appState: AppProps = {replace: (children)=>root.replaceChildren(children)};

    root.replaceChildren(<App props={appState}/>);

    window.onunload = ()=>{appState.onunload?.()};
}

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);