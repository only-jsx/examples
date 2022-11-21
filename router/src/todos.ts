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

export function sleep(n: number = 500) {
    return new Promise((r) => setTimeout(r, n));
}

export async function getTodos(): Promise<Todos> {
    await sleep(2000);

    let todos: Todos | null = null;
    try {
        todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    } catch (e) { }
    if (!todos) {
        todos = initializeTodos();
    }
    return todos;
}

export async function addTodo(todo: string): Promise<void> {
    const todos = await getTodos();
    let newTodos = { ...todos };
    newTodos[uuid()] = todo;
    saveTodos(newTodos);
}

export async function deleteTodo(id: string): Promise<void> {
    const todos = await getTodos();
    let newTodos = { ...todos };
    delete newTodos[id];
    saveTodos(newTodos);
}