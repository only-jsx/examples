import App, {AppProps} from './app';
import {Fragment, JsxRef} from 'only-jsx/jsx-runtime';

function render() {
    const root = document.getElementById('root');
    const appRef: JsxRef = {};
    const appProps: AppProps = {
        a:1,
        b:2,
        replace: (e: HTMLElement )=> root.replaceChild(e, appRef.current),
    };

    function onClick() {
        appProps.a++;
        appProps.b++;
        appProps.update?.();
    }

    root.replaceChildren(<Fragment>
        Only jsx is here!
        <div>
            <button onclick={onClick}>Change App props</button>
        </div>
        <App props={appProps} ref={appRef}><span>It is App</span></App>
    </Fragment>);
}

render();