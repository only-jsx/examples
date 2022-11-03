import styles from './app.module.css';
import { OptionsChildren, JsxRef } from 'only-jsx/jsx-runtime';

interface GhContrubutor {
    login: string;
    contributions: number;
}

export interface AppProps {
    a: number;
    b: number;
    replace: (e: HTMLElement) => void;
    update?: () => void;
}

export default ({ props, children, ref }: { props: AppProps, children?: OptionsChildren, ref: JsxRef }) => {
    const result: { current?: HTMLElement } = {};
    const e = <div data-custom-sum={props.a + props.b} class={styles.container}>
        {children}
        <span>{props.a}+{props.b}={props.a + props.b}</span>
        <button onclick={onClickFetch}>Fetch</button>
        <div id='counter' style='color: blue;'></div>
        <div ref={result}></div>
        <button onclick={onClickReplace}>Replace App</button>
    </div>;

    ref.current = e;

    function onClickReplace() {
        const ne = <p>App content was completely replaced</p>;
        props.replace(ne);
        props.update = function () {
            ne.innerText = this.a + '+' + this.b + '=' + (this.a + this.b);
        }
        ref.current = ne;
    }

    let counter = 0;
    function onClickFetch() {
        fetch('https://api.github.com/repos/only-jsx/jsx-runtime/contributors').then(data => {
            counter++;
            data.json().then((contributors: GhContrubutor[]) => {
                const c = contributors.map(user => <div>{user.login} - {user.contributions}</div>)
                result.current.replaceChildren(...c);
                result.current.className = styles.result;
            }).catch(err => {
                result.current.replaceChildren(err.message);
                result.current.className = styles.error;
            });
            e.querySelector('#counter').replaceChildren(<span>Request #{counter}</span>);
        });
    }

    props.update = function () {
        e.dataset.customSum = this.a + this.b;
        e.querySelector(':nth-child(2)').innerText = this.a + '+' + this.b + '=' + (this.a + this.b);
    }

    return e;
}