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
} from "./routes";

import { Router, Route } from 'only-jsx-router';
import { setContext } from 'only-jsx/jsx-runtime';

export interface AppProps {
    onunload?: () => void;
}

const App = ({ props }: { props: AppProps }): DocumentFragment => {
    const ctx: any = {};
    setContext(Router, ctx);

    let r = <Router>
        <Route path="/(.*)">
            <Layout />
            <Route path="home"><Home /></Route>
            <Route path="await"><AwaitPage /></Route>
            <Route path="long-load"><LongLoad/></Route>
            <Route path="todos" error={ErrorBoundary}>
                <TodosList />
            </Route>
            <Route path="todos/(.*)" error={ErrorBoundary}>
                <h5>Todo</h5>
                <Route path=":id"><Todo /></Route>
            </Route>
            <Route path="error" error={ErrorBoundary}><ErrorComponent/></Route>
            <Route><Fallback /></Route>
        </Route>
    </Router>

    props.onunload = ctx.router.onunload;
    return r;
}

export default App;