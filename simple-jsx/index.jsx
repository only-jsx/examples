import App from './app';

function render() {
    const root = document.getElementById('root');
    const appRef = {};
    const appProps = {
        a:1,
        b:2,
        replace: e=> root.replaceChild(e, appRef.current),
    };

    function onClick() {
        appProps.a++;
        appProps.b++;
        appProps.update?.();
    }

    root.replaceChildren(<>
        Only jsx is here!
        <div>
            <button onclick={onClick}>Change App props</button>
        </div>
        <App props={appProps} ref={appRef}><span>It is App</span></App>
    </>);
}

render();