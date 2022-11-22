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
    UnloadProps,
} from "./routes";

import { Router, Route } from 'only-jsx-router';
import { setContext } from 'only-jsx/jsx-runtime';

export interface AppProps {
    onunload?: () => void;
}

const App = ({ props }: { props: AppProps }): DocumentFragment => {
    const ctx: any = {};
    setContext(Router, ctx);

    const unloadProps: UnloadProps = {};

    let r = <Router>
        <Route path="/(.*)">
            <Layout />
            <Route path="home"><Home /></Route>
            <Route path="await"><AwaitPage props={unloadProps}/></Route>
            <Route path="long-load"><LongLoad props={unloadProps}/></Route>
            <Route path="todos" error={ErrorBoundary}>
                <TodosList props={unloadProps}/>
            </Route>
            <Route path="todos/(.*)" error={ErrorBoundary}>
                <h5>Todo</h5>
                <Route path=":id"><Todo props={unloadProps}/></Route>
            </Route>
            <Route path="error" error={ErrorBoundary}><ErrorComponent/></Route>
            <Route><Fallback /></Route>
        </Route>
    </Router>

    ctx.router.onnavigate = ()=>{
        unloadProps.onunload?.();
        unloadProps.onunload = undefined;
    }

    props.onunload = ()=>{
        ctx.router.onnavigate();
        ctx.router.onunload?.();
    };
    return r;
}

export default App;