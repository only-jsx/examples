import * as styles from './indicator.module.css';

export interface IdicatorProps {
    name?: string;
    count: number;
    total: number;
    background: string
}

const Indicator = ({props}:{props: IdicatorProps}): HTMLElement => {
    const width = props.total ? Math.round(100 * props.count / props.total) + '%' : '100%';

    return <div class={styles.container}>
        <div><span>{props.name}</span><span class={styles.counter}>{props.count}</span></div>
        <div class={styles.line}><div class={styles.fill} style={`width: ${width}; background: ${props.background};`}></div></div>
    </div>;
};

export default Indicator;