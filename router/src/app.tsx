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
    WithUnload,
} from "./routes";

import { Router, Route } from 'only-jsx-router';
import { setContext } from 'only-jsx/jsx-runtime';

export interface AppProps {
    onunload?: () => void;
}

const App = ({ props }: { props: AppProps }): DocumentFragment => {
    const ctx: any = {};
    setContext(Router, ctx);

    const unloadState: WithUnload = {};

    let r = <Router>
        <Route path="/(.*)">
            <Layout />
            <Route path="home"><Home /></Route>
            <Route path="await"><AwaitPage state={unloadState}/></Route>
            <Route path="long-load"><LongLoad state={unloadState}/></Route>
            <Route path="todos" error={ErrorBoundary}>
                <TodosList state={unloadState}/>
            </Route>
            <Route path="todos/(.*)" error={ErrorBoundary}>
                <h5>Todo</h5>
                <Route path=":id"><Todo state={unloadState}/></Route>
            </Route>
            <Route path="error" error={ErrorBoundary}><ErrorComponent/></Route>
            <Route><Fallback /></Route>
        </Route>
    </Router>

    ctx.router.onnavigate = ()=>{
        unloadState.onunload?.();
        unloadState.onunload = undefined;
    }

    props.onunload = ()=>{
        ctx.router.onnavigate();
        ctx.router.onunload?.();
    };
    return r;
}

export default App;