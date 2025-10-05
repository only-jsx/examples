import StatHeader from './statHeader';
import * as styles from './indicatorsCardsGroup.module.css';
import IndicatorsCard, { IndicatorsCardProps } from './indicatorsCard';

export interface IndicatorsCardsProps {
    title?: string;
    image?: string;
    info: IndicatorsCardProps;
}

interface IndicatorsCardsGroupProps {
    cards: IndicatorsCardsProps[];
}

const IndicatorsCardsGroup = ({props}: {props: IndicatorsCardsGroupProps}): HTMLElement => <div class={styles.container}>
    {props.cards?.map((card: IndicatorsCardsProps) => {
        const total = card.info.indicators?.reduce((a: number, b) => a + b.count, 0);
        return <div class={styles.card}>
            <StatHeader props = {{image: card.image, title: card.title, rightText: `Total: ${total || ''}`}} />
            <IndicatorsCard props = {card.info} />
        </div>;
    })}
</div>;

export default IndicatorsCardsGroup;