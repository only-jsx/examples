import App, {AppProps} from './app';

function render() {
    const root = document.getElementById('root');

    const appProps: AppProps = {};

    root.replaceChildren(<App props={appProps}/>);

    window.onunload = ()=>{appProps.onunload?.()};
}

render();