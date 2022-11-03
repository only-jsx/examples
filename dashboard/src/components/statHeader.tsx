import styles from './statHeader.module.css';

interface StatHeaderProps {
    title?: string;
    rightText?: string;
    image?: string;
    rightColor?: string;
}

const StatHeader = ({props}: {props : StatHeaderProps}): HTMLElement => <div class={styles.container}>
    <span>
        <span class={styles.image + ' material-symbols-outlined'}>
            {props.image}
        </span>
        {props.title}
    </span>
    {props.title && props.rightText && <span style={`color: ${props.rightColor || 'var(--color-right-text)'}` }
        class={styles.rightSpan}>
        {props.rightText}
    </span>}
</div>;

export default StatHeader;