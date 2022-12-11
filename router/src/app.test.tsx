import App, { AppProps } from './app';
import { setContext } from 'only-jsx/jsx-runtime';
import { Context } from 'only-jsx-router';
import {
    Todo,
    UnloadState,
} from "./routes";

describe('App tests', () => {
    const itTab = (name: string, navigate: string, text: string) => it(name, () => {
        history.pushState({}, '', navigate);
        const appProps: AppProps = {};
        const app: DocumentFragment = <App props={appProps} />;
        expect(app.textContent.includes(text)).toBeTruthy();
        appProps.onunload?.();
    });

    itTab('app main page', '/router', 'Click on over to /todos and check out these data loading APIs!');
    itTab('home page', '/router/home', 'Last loaded at:');
    itTab('todo list page', '/router/todos', 'Click this link to force an error in the loader');
    itTab('todo page', '/router/todos/junk', 'Todo');
    itTab('wrong page', '/router/wrong', 'Route does not exist');
});

test('renders todo item page', () => {

    const ctx: Context = {
        router: {
            path: '/react-router/todo/1',
            params: { id: '1' },
        }
    };

    setContext(Todo, ctx)

    const state: UnloadState = {};
    const t: DocumentFragment = <Todo state={state} />;

    expect(t.childNodes.length === 1);
    expect(t.childNodes.item(0)?.textContent === 'Todo will appear here soon');

    state.onunload?.();
});
