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

import { Router, Route } from 'only-jsx-router';
import { setContext } from 'only-jsx/jsx-runtime';

export interface AppProps {
    onunload?: () => void;
}

const App = ({ props }: { props: AppProps }): DocumentFragment => {
    const ctx: any = {};
    setContext(Router, ctx);

    const state: UnloadState = {};

    const onnavigate = () => {
        state.onunload?.();
        state.onunload = undefined;
    }

    let r = <Router onnavigate={onnavigate}>
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