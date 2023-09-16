import classes from './AppCheckBox.module.css';
import { OptionsChildren } from 'only-jsx/jsx-runtime';

interface AppCheckBoxProps extends OptionsChildren {
    id?: string;
    checked?: boolean;
    onChange?: (v: boolean) => void;
}

export default (props: AppCheckBoxProps) => {
    const c = props.checked ? 'checked' : undefined;
    return <div class={classes.main}>
        <input type='checkbox' id={props.id} name={props.id} checked={c} onchange={(e: Event) => { props.onChange?.((e.target as HTMLInputElement).checked) }} />
        {props.children && <label for={props.id}>{props.children}</label>}
    </div>;
}