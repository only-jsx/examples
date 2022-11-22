interface Todos {
    [key: string]: string;
}

const TODOS_KEY = "todos";

export const uuid = () => Math.random().toString(36).substring(2, 9);

export function saveTodos(todos: Todos): void {
    return localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function initializeTodos(): Todos {
    let todos: Todos = new Array(10)
        .fill(null)
        .reduce(
            (acc, _, index) =>
                Object.assign(acc, { [uuid()]: `Seeded Todo #${index + 1}` }),
            {}
        );
    saveTodos(todos);
    return todos;
}

export function sleep(n: number, signal: AbortSignal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, n);
        signal.addEventListener('abort', () => {
            clearInterval(timeout);
            reject('Sleep rejected!');
        });
    }
    );
}

export async function getTodos(signal: AbortSignal): Promise<Todos> {
    await sleep(2000, signal);

    let todos: Todos | null = null;
    try {
        todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    } catch (e) { }
    if (!todos) {
        todos = initializeTodos();
    }
    return todos;
}

export async function addTodo(todo: string, signal: AbortSignal): Promise<void> {
    const todos = await getTodos(signal);
    let newTodos = { ...todos };
    newTodos[uuid()] = todo;
    saveTodos(newTodos);
}

export async function deleteTodo(id: string, signal: AbortSignal): Promise<void> {
    const todos = await getTodos(signal);
    let newTodos = { ...todos };
    delete newTodos[id];
    saveTodos(newTodos);
}