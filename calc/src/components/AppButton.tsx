import classes from './AppButton.module.css';
import { OptionsChildren } from 'only-jsx/jsx-runtime';

interface AppButtonProps extends OptionsChildren {
    isDisabled: boolean;
    onclick: () => void;
}

export default (props: AppButtonProps) => <button class={classes.main} disabled={props.isDisabled} onclick={props.onclick}>{props.children}</button>;