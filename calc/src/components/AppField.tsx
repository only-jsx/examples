import classes from './AppField.module.css';
import CancelIcon from './CancelIcon';
import { Options } from 'only-jsx/jsx-runtime';

interface AppFieldProps extends Options {
    id?: string;
    value?: string;
    placeholder?: string;
    title?: string;
    onChange?: (v: string) => string | undefined | null;
}

export default (props: AppFieldProps) => {
    const span: { current?: HTMLSpanElement } = {};
    const input: { current?: HTMLInputElement } = {};

    function handleInput(e?: InputEvent) {
        const el = e?.target as HTMLInputElement || input.current;
        const value = props.onChange?.(el.value);

        if (value != el.value) {
            el.value = value || '';
        }

        span.current!.style.visibility = value ? 'visible' : 'hidden';
        span.current!.onclick = value ? handleClear : null;
    }

    function handleClear(e: MouseEvent) {
        input.current!.value = '';
        handleInput();
    }

    function handleClick(e: MouseEvent) {
        if (e.currentTarget == e.target) {
            input.current?.focus();
        }
    }
    
    return <div class={classes.main} onclick={handleClick}>
        <input
            ref={input}
            id={props.id}
            name={props.id}
            type='text'
            oninput={handleInput}
            value={props.value}
            placeholder={props.placeholder}
        />
        {props.value && <label for={props.id} class={classes.label}>{props.title}</label>}
        <span ref={span} class={classes.actions} style={props.value ? null : 'visibility: hidden'}>
            <CancelIcon />
        </span>
    </div>;
}