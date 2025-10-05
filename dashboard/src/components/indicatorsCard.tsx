import Indicator from './indicator';
import * as styles from './indicatorsCard.module.css';

export interface IndicatorProps {
    type: string;
    count: number;
}

export interface IndicatorsCardProps {
    title: string;
    indicators?: IndicatorProps[];
}

const IndicatorsCard = ({props}: {props: IndicatorsCardProps}): HTMLElement => {
    const colors = ['#95A6DD', '#F3C96B', '#84BFDB', '#D38BC3', '#F4B77E'];
    const total = props.indicators?.reduce((a: number, b: IndicatorProps) => a + b.count, 0) || 0;

    return <div class={styles.container}>
        <div>{props.title}</div>
        {props.indicators?.map((i: IndicatorProps, n: number) => <Indicator props={{background: colors[n % colors.length], total, ...i}} />)}
    </div>;
};

export default IndicatorsCard;