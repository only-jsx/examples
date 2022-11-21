import { addTodo, deleteTodo, getTodos } from "./todos";

function onClick(ctx: any, e: Event) {
    e.preventDefault();
    ctx.router?.navigate((e.target as HTMLAnchorElement).href);
}

export function Layout(props: any, ctx: any) {
    const onclick = onClick.bind(this, ctx);
    return (
        <>
            <nav>
                <a href="/home" onclick={onclick}>Home</a>
                &nbsp;|&nbsp;
                <a href="/todos" onclick={onclick}>Todos</a>
                &nbsp;|&nbsp;
                <a href="/await" onclick={onclick}>Await</a>
                &nbsp;|&nbsp;
                <a href="/long-load" onclick={onclick}>Long Load</a>
                &nbsp;|&nbsp;
                <a href="/error" onclick={onclick}>Error</a>
                &nbsp;|&nbsp;
                <a href="/wrong" onclick={onclick}>Wrong path</a>
            </nav>
            <p>
                Click on over to <a href="/todos" onclick={onclick}>/todos</a> and check out these
                data loading APIs!
            </p>
        </>
    );
}

interface HomeLoaderData {
    date: string;
}

async function homeLoader(): Promise<HomeLoaderData> {
    return {
        date: new Date().toISOString(),
    };
}

export function Home() {
    const p: { current?: HTMLElement } = {};
    const last = 'Last loaded at:';
    const e = <>
        <h2>Home</h2>
        <p ref={p}>{last}</p>
    </>
    homeLoader().then(data => {
        p.current.innerText = last + ' ' + data.date;
    })
    return e;
}

export function TodosList(props: any, ctx: any) {

    const btnRef: { current?: HTMLButtonElement } = {};
    const urRef: { current?: HTMLElement } = {};
    const formRef: { current?: HTMLFormElement } = {};

    const onclick = onClick.bind(this, ctx);

    const firstItem = <li>
        <a href="/todos/junk" onclick={onclick}>
            Click this a to force an error in the loader
        </a>
    </li>;

    function fillTodos(todos: object) {
        Object.entries(todos).forEach(([id, todo]) => {
            urRef.current.appendChild(<li>
                <TodoItem id={id} todo={todo} onClick={onclick} />
            </li>);
        });
    }

    async function onSubmit(e: MouseEvent) {
        e.preventDefault();

        btnRef.current.innerText = 'Adding...';
        btnRef.current.disabled = true;
        await addTodo((formRef.current['todo'] as HTMLInputElement).value);

        const todos = await getTodos();

        btnRef.current.innerText = 'Add';
        btnRef.current.disabled = false;
        urRef.current.replaceChildren(firstItem);

        fillTodos(todos);

        formRef.current?.reset();

        return false;
    }

    getTodos().then(fillTodos);

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
            <input name="todo"></input>
            <button ref={btnRef}>Add</button>
        </form>
    </>

    return e;
}

export function ErrorBoundary({router} : {router: any}) {
    return (
        <>
            <h2>Error 💥</h2>
            <p>At path "{router.path}"</p>
            <p>Params: {JSON.stringify(router.params)}</p>
            <p>{router.error.message}</p>
        </>
    );
}

interface TodoItemProps {
    id: string;
    todo: string;
    onClick: (e: Event) => void;
}

export function TodoItem({ id, todo, onClick }: TodoItemProps) {

    const btnRef: { current?: HTMLButtonElement } = {};
    const formRef: { current?: HTMLFormElement } = {};

    async function onSubmit(e: MouseEvent) {
        e.preventDefault();

        btnRef.current.innerText = 'Deleting...';
        btnRef.current.disabled = true;
        await deleteTodo((formRef.current['todoId'] as HTMLButtonElement).value);

        btnRef.current.innerText = 'Delete';
        btnRef.current.disabled = false;

        const li = formRef.current.parentNode;
        li.parentNode.removeChild(li);

        return false;
    }

    return (
        <>
            <a href={`/todos/${id}`} onclick={onClick}>{todo}</a>
            &nbsp;
            <form style='display: inline' onsubmit={onSubmit} ref={formRef}>
                <button name="todoId" value={id} ref={btnRef}>
                    Delete
                </button>
            </form>
        </>
    );
}

async function todoLoader(params: { id: string }): Promise<string> {
    let todos = await getTodos();
    if (!params.id) {
        throw new Error("Expected params.id");
    }
    let todo = todos[params.id];
    if (!todo) {
        throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
    }
    return todo;
}

export function Todo(props: any, ctx: any) {
    const t = document.createComment('Todo will appear here soon');
    const { params } = ctx.router;
    todoLoader(params).then(todo => {
        t.parentNode.replaceChild(<><h2>Nested Todo Route:</h2>
            <p>id: {params.id}</p>
            <p>todo: {todo}</p></>, t);
    }).catch(error=>{
        const router = {...ctx.router, error};
        t.parentNode.replaceChild(<ErrorBoundary router={router}></ErrorBoundary>, t);    
    });
    return t;
}

export function AwaitPage() {
    const r: { current?: HTMLElement } = {};
    const t = <p ref={r}>Awaiting raw promise</p>;

    const rawPromise: Promise<string> = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Resolved raw promise!');
        }, 1000);
    });

    rawPromise.then(data => r.current.innerText = data)
        .catch(err => r.current.innerText = 'Rejected raw promise!');

    return t;
}

export function LongLoad() {
    const r: { current?: HTMLElement } = {};
    const s = 'Loading...';
    const p = <p ref={r}>{s}</p>;
    let n = s.length;
    const id = setInterval(() => {
        if (--n < 1) {
            r.current.parentNode.replaceChild(<h1>👋</h1>, r.current);
            clearInterval(id);
        } else {
            r.current.innerText = s.substring(0, n);
        }

    }, 1000);
    return p;
}

export function ErrorComponent() {
    throw new Error('Error in route handler!');
}

export function Fallback() {
    return <p>Route does not exists</p>;
}
