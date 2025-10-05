import StatHeader from './statHeader';
import * as styles from './doubleIndicatorsCard.module.css';

interface IndicatorProps {
    type: string;
    count: number;
}

export interface DoubleIndicatorsCardProps {
    title: string;
    head: {
        title: string;
        image: string;
    };
    indicators: [IndicatorProps, IndicatorProps];
}

const DoubleIndicatorsCard = ({props}: {props: DoubleIndicatorsCardProps}): DocumentFragment => {
    const colors = ['#F4B77E', '#95A6DD'];
    const total = props.indicators.reduce((a: number, b: IndicatorProps) => a + b.count, 0) || 0;
    const width = total ? props.indicators.map((d: IndicatorProps) => Math.round((100 * d.count) / total) + '%') : ['50%', '50%'];

    return <>
        <StatHeader props = {{...props.head, rightText: `Total: ${total}`}} />
        <div class={styles.сontainer}>
            <div>{props.title}</div>
            <div class={styles.indicators}>
                <div style={`width: ${width[0]}`}>
                    <div>
                        <span style='padding-left: 5px'>{props.indicators[0].type}</span>
                        <span class={styles.counter} style='padding-right: 5px'>
                            {props.indicators[0].count}
                        </span>
                    </div>
                    <div
                        class={styles.line}
                        style={`background-color: ${colors[0]}`}
                    ></div>
                </div>
                <div style={`width: ${width[1]}`}>
                    <div>
                        <span style='padding-left: 5px'>
                            {props.indicators[1].count}
                        </span>
                        <span class={styles.counter}>
                            {props.indicators[1].type}
                        </span>
                    </div>
                    <div
                        class={styles.line}
                        style={`background-color: ${colors[1]}`}
                    ></div>
                </div>
            </div>
        </div>
    </>;
};

export default DoubleIndicatorsCard;
