import StatHeader from './statHeader';
import styles from './newCardsGroup.module.css';
import NewCard, { NewCardProps } from './newCard';
import Tooltip from './tooltip';
import tooltips from '../tooltips.json';

export interface NewCardsGroupProps {
    days: number;
    cards: NewCardProps[];
}

const {new_solutions, new_products, new_components} = (tooltips as { [key: string]: string; });
const titles = [new_solutions, new_products, new_components];

const NewCardsGroup = ({props}:{ props: NewCardsGroupProps}): DocumentFragment => <>
    <StatHeader props={{image:'home', title: 'Software', rightColor: 'var(--color-grey)', rightText:`for last ${props.days} days`}} />
    <div class={styles.container}>
        {props.cards.map((card: NewCardProps, n: number) =><Tooltip props={{title: titles[n]}}><NewCard {...card}/></Tooltip>)}
    </div>
</>;

export default NewCardsGroup;