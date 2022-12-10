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
import { tokensToRegexp, parse, Key } from 'path-to-regexp';

export interface AppProps {
    onunload?: () => void;
}

function match(path: string): PathMatch {
    const keys: Key[] = [];
    const tokens = parse(path[0] === '#' ? path : '#' + path);
    const pattern = tokensToRegexp(tokens, keys);

    const { hash } = window.location;
    const match = pattern.exec(hash);
    if (!match) {
        return {};
    }

    const params: Params = {};
    for (let i = 1; i < match.length; i++) {
        params[keys[i - 1]['name']] = match[i];
    }

    let nextPath = '';
    if (typeof tokens[0] === 'string') {
        nextPath = (tokens[1] as Key)?.prefix ? tokens[0] + (tokens[1] as Key).prefix : tokens[0];
    } else {
        nextPath = tokens[0].prefix || '';
    }

    return { match, params, nextPath };
}

function getCurrentPath() {
    return window.location.hash;
}

const App = ({ props, hash }: { props: AppProps, hash?: boolean }): DocumentFragment => {
    const ctx: Context = { router: {} };
    setContext(Router, ctx);
    const state: UnloadState = {};

    const onnavigate = () => {
        state.onunload?.();
        state.onunload = undefined;
    }

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
        ctx.router.update();
    }

    let navigate : (path: string, data?: any, replace?: boolean)=>void;

    if (hash) {
        navigate = hashNavigate;
        ctx.router.match = match;
        ctx.router.changeEvent = 'hashchange';
        ctx.router.getCurrentPath = getCurrentPath;
    } else {
        navigate = historyNavigate;
    }

    ctx.router.navigate = (path: string) => {
        onnavigate();
        navigate(path);
    }

    const r = <Router>
        <Route path="/router(.*)">
            <Layout />
        </Route>
        <Route path="/router/(.*)">
            <Route path="home"><Home /></Route>
            <Route path="await"><AwaitPage state={state} /></Route>
            <Route path="long-load"><LongLoad state={state} /></Route>
            <Route path="todos" error={ErrorBoundary}>
                <TodosList state={state} />
            </Route>
            <Route path="todos/(.*)" error={ErrorBoundary}>
                <h5>Todo</h5>
                <Route path=":id"><Todo state={state} /></Route>
            </Route>
            <Route path="error" error={ErrorBoundary}><ErrorComponent /></Route>
            <Route><Fallback /></Route>
        </Route>
    </Router>

    props.onunload = () => {
        onnavigate();
        ctx.router.onunload?.();
    };

    return r;
}

export default App;