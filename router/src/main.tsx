import App, { AppProps } from './app';

function render() {
    const root = document.getElementById('root');

    const appProps: AppProps = {};
    const hashAppProps: AppProps = {};

    root.replaceChildren(<>
        <h2>This part is routed by History</h2>
        <App props={appProps} />
        <h2>This part is routed by Url hash</h2>
        <App props={hashAppProps} hash />
    </>);

    window.onunload = () => { appProps.onunload?.() };
}

render();