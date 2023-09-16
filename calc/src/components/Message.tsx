import classes from './Message.module.css';

type MessageType = 'none' | 'info' | 'error';

export interface MessageProps {
    type: MessageType;
    text: string;
    title: string;
    onKeyDown?: (e: KeyboardEvent) => void;
    onClick?: (e: MouseEvent) => void;
}

export default (props: MessageProps) => <div class={classes.main + ' ' + classes[props.type]} tabIndex={0} onclick={props.onClick} onkeydown={props.onKeyDown}>
    <span class={classes.title}>{props.title}</span>
    {props.text}
</div>;
