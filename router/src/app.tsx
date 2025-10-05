import {
    Fallback,
    Layout,
    Home,
    Todo,
    TodosList,
    ErrorBoundary,
    LongLoad,
    ErrorComponent,
    AwaitPage,
    UnloadState,
} from "./routes";

import { Router, Route, PathMatch, Params, Context } from 'only-jsx-router';
import { setContext } from 'only-jsx/jsx-runtime';
import { parse, pathToRegexp } from 'path-to-regexp';

export interface AppProps {
    onunload?: () => void;
}

function match(path: string): PathMatch {
    const { tokens } = parse(path[0] === '#' ? path.slice(1) : path);
    const { regexp, keys } = pathToRegexp(path);

    const { hash } = window.location;
    const match = regexp.exec(hash.slice(1));

    if (!match) {
        return {};
    }

    const params: Params = {};

    for (let i = 0; i < keys.length; i++) {
        if (keys[i].type === 'param' && match[i + 1]) {
            params[keys[i].name] = match[i + 1];
        }
    }

    const nextPath = tokens[0].type === 'text' ? tokens[0].value : '';

    return { match, params, nextPath };
}

function getCurrentPath() {
    return window.location.hash;
}

const App = ({ props, hash }: { props: AppProps, hash?: boolean }): DocumentFragment => {
    const ctx: Context = { router: {} };
    setContext(Router, ctx);
    const state: UnloadState = {};

    function hashNavigate(path: string, data?: any, replace?: boolean) {
        if (replace) {
            window.location.replace('#' + path);
        } else {
            window.location.assign('#' + path);
        }
    }
    
    function historyNavigate(path: string, data?: any, replace?: boolean) {
        if (replace) {
            window.history.replaceState(data, '', path + window.location.hash);
        } else {
            window.history.pushState(data, '', path + window.location.hash);
        }
        ctx.router.update?.();
    }

    if (hash) {
        ctx.router.navigate = hashNavigate;
        ctx.router.match = match;
        ctx.router.changeEvent = 'hashchange';
        ctx.router.getCurrentPath = getCurrentPath;
    } else {
        ctx.router.navigate = historyNavigate;
    }

    const onbeforeupdate = () => {
        state.onunload?.();
        state.onunload = undefined;
    }
    
    const r = <Router onbeforeupdate={onbeforeupdate}>
        <Route path="/router{*page}">
            <Layout />
        </Route>
        <Route path="/router/*page">
            <Route path="home"><Home /></Route>
            <Route path="await"><AwaitPage state={state} /></Route>
            <Route path="long-load"><LongLoad state={state} /></Route>
            <Route path="todos" error={ErrorBoundary}>
                <TodosList state={state} />
            </Route>
            <Route path="todos/*todo" error={ErrorBoundary}>
                <h5>Todo</h5>
                <Route path=":id"><Todo state={state} /></Route>
            </Route>
            <Route path="error" error={ErrorBoundary}><ErrorComponent /></Route>
            <Route><Fallback /></Route>
        </Route>
    </Router>

    props.onunload = () => {
        onbeforeupdate();
        ctx.router.onunload?.();
    };

    return r;
}

export default App;