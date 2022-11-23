import { addTodo, deleteTodo, getTodos } from './todos';
import { Context, Params, RouterContext } from 'only-jsx-router';

export interface UnloadState { onunload?: () => void };
export interface PropsWithState { state: UnloadState };

function onClick(ctx: Context, e: Event) {
    e.preventDefault();
    ctx.router?.navigate((e.target as HTMLAnchorElement).href);
}

export function Layout(state: any, ctx: Context) {
    const onclick = onClick.bind(this, ctx);
    return (
        <>
            <nav>
                <a href='/home' onclick={onclick}>Home</a>
                &nbsp;|&nbsp;
                <a href='/todos' onclick={onclick}>Todos</a>
                &nbsp;|&nbsp;
                <a href='/await' onclick={onclick}>Await</a>
                &nbsp;|&nbsp;
                <a href='/long-load' onclick={onclick}>Long Load</a>
                &nbsp;|&nbsp;
                <a href='/error' onclick={onclick}>Error</a>
                &nbsp;|&nbsp;
                <a href='/wrong' onclick={onclick}>Wrong path</a>
            </nav>
            <p>
                Click on over to <a href='/todos' onclick={onclick}>/todos</a> and check out these
                data loading APIs!
            </p>
        </>
    );
}

export function Home() {
    return <>
        <h2>Home</h2>
        <p>Last loaded at: {new Date().toISOString()}</p>
    </>
}

export function TodosList({ state }: PropsWithState, ctx: Context) {

    const btnRef: { current?: HTMLButtonElement } = {};
    const urRef: { current?: HTMLElement } = {};
    const formRef: { current?: HTMLFormElement } = {};

    const onclick = onClick.bind(this, ctx);

    const firstItem = <li>
        <a href='/todos/junk' onclick={onclick}>
            Click this a to force an error in the loader
        </a>
    </li>;

    function fillTodos(todos: object) {
        Object.entries(todos).forEach(([id, todo]) => {
            urRef.current.appendChild(<li>
                <TodoItem id={id} todo={todo} onClick={onclick} state={state} />
            </li>);
        });
    }

    const controller = new AbortController();

    state.onunload = () => controller.abort();

    async function onSubmit(e: MouseEvent) {
        e.preventDefault();

        btnRef.current.innerText = 'Adding...';
        btnRef.current.disabled = true;

        state.onunload = () => controller.abort();
        await addTodo((formRef.current['todo'] as HTMLInputElement).value, controller.signal);

        const todos = await getTodos(controller.signal);
        delete state.onunload;

        btnRef.current.innerText = 'Add';
        btnRef.current.disabled = false;
        urRef.current.replaceChildren(firstItem);

        fillTodos(todos);

        formRef.current?.reset();

        return false;
    }

    getTodos(controller.signal).then(fillTodos).finally(() => delete state.onunload);

    const e = <>
        <h2>Todos</h2>
        <p>
            This todo app uses a &lt;form&gt; to submit new todos and to delete todos. Click on a todo item to navigate
            to the /todos/:id route.
        </p>
        <ul ref={urRef}>
            {firstItem}
        </ul>
        <form onsubmit={onSubmit} ref={formRef}>
            <input name='todo'></input>
            <button ref={btnRef}>Add</button>
        </form>
    </>

    return e;
}

export function ErrorBoundary({ router }: { router: RouterContext }) {
    return (
        <>
            <h2>Error 💥</h2>
            <p>At path '{router.path}'</p>
            <p>Params: {JSON.stringify(router.params)}</p>
            <p>{router.error.message}</p>
        </>
    );
}

interface TodoItemstate {
    id: string;
    todo: string;
    onClick: (e: Event) => void;
    state: UnloadState;
}

export function TodoItem({ id, todo, onClick, state }: TodoItemstate) {

    const btnRef: { current?: HTMLButtonElement } = {};
    const formRef: { current?: HTMLFormElement } = {};

    const e = <>
        <a href={`/todos/${id}`} onclick={onClick}>{todo}</a>
        &nbsp;
        <form style='display: inline' onsubmit={onSubmit} ref={formRef}>
            <button name='todoId' value={id} ref={btnRef}>
                Delete
            </button>
        </form>
    </>

    async function onSubmit(e: MouseEvent) {
        e.preventDefault();

        const controller = new AbortController();

        state.onunload = () => controller.abort();

        btnRef.current.innerText = 'Deleting...';
        btnRef.current.disabled = true;
        await deleteTodo((formRef.current['todoId'] as HTMLButtonElement).value, controller.signal);
        delete state.onunload;

        btnRef.current.innerText = 'Delete';
        btnRef.current.disabled = false;

        const li = formRef.current.parentNode;
        li.parentNode.removeChild(li);

        return false;
    }

    return e;
}

async function todoLoader(params: Params, signal: AbortSignal): Promise<string> {
    let todos = await getTodos(signal);
    if (!params.id) {
        throw new Error('Expected params.id');
    }
    let todo = todos[params.id];
    if (!todo) {
        throw new Error(`Uh oh, I couldn't find a todo with id '${params.id}'`);
    }
    return todo;
}

export function Todo({ state }: PropsWithState, ctx: Context) {
    const t = document.createComment('Todo will appear here soon');
    const { params } = ctx.router;

    const controller = new AbortController();

    state.onunload = () => controller.abort();

    todoLoader(params, controller.signal).then(todo => {
        t.parentNode.replaceChild(<><h2>Nested Todo Route:</h2>
            <p>id: {params.id}</p>
            <p>todo: {todo}</p></>, t);
    }).catch(error => {
        console.log(error);
        const router = { ...ctx.router, error };
        t.parentNode?.replaceChild(<ErrorBoundary router={router}></ErrorBoundary>, t);
    }).finally(() => delete state.onunload);

    return t;
}

export function AwaitPage({ state }: PropsWithState) {
    const r: { current?: HTMLElement } = {};
    const t = <p ref={r}>Awaiting raw promise</p>;

    const controller = new AbortController();
    const signal = controller.signal;

    state.onunload = () => controller.abort();

    const rawPromise: Promise<string> = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve('Resolved raw promise!');
        }, 5000);

        signal.addEventListener('abort', () => {
            clearInterval(timeout);
            reject('Rejected raw promise!')
        });
    });

    rawPromise.then(data => r.current.innerText = data)
        .catch(console.log)
        .finally(() => delete state.onunload);

    return t;
}

export function LongLoad({ state }: PropsWithState) {
    const r: { current?: HTMLElement } = {};
    const s = 'Loading...';
    const p = <p ref={r}>{s}</p>;
    let n = s.length;
    const id = setInterval(() => {
        if (--n < 1) {
            r.current.parentNode.replaceChild(<h1>👋</h1>, r.current);
            clearInterval(id);
            delete state.onunload;
        } else {
            r.current.innerText = s.substring(0, n);
        }

    }, 1000);

    state.onunload = () => clearInterval(id);

    return p;
}

export function ErrorComponent() {
    throw new Error('Error in route handler!');
}

export function Fallback() {
    return <p>Route does not exists</p>;
}
