import * as styles from './teamCardsTooltip.module.css';
import IndicatorsCardGroup, { IndicatorsCardsProps } from './indicatorsCardsGroup';
import { IndicatorProps } from './indicatorsCard';
import { apiUrl } from '../config';

export const tooltipWidth = 928;

export interface TeamCardsTooltipProps {
    teamId?: number;
    connectionLeft: number;
    top: number;
    left: number;
    onClose: () => void;
    onunload?: () => void;
}

const getTeamCards = (data: { products: IndicatorProps[]; productTypes: IndicatorProps[]; components: IndicatorProps[] }): IndicatorsCardsProps[] => [
    {
        image: 'thumb_up',
        title: 'Products',
        info: {
            title: 'Status',
            indicators: data.products,
        },
    },
    {
        info: {
            title: 'Type',
            indicators: data.productTypes,
        },
    },
    {
        image: 'grid_view',
        title: 'Components',
        info: {
            title: 'Status',
            indicators: data.components,
        },
    },
];

const TeamCardsTooltip = ({ props }: { props: TeamCardsTooltipProps }): HTMLElement => {
    const contentRef: { current?: HTMLElement } = {};

    const tooltipStyle = `width: ${tooltipWidth}px; top: ${props.top}px; left: ${props.left}px;`;

    const e: HTMLElement = <div class={styles.tooltip} style={tooltipStyle}>
        <div class={styles.tooltipTitle}>
            <button onclick={props.onClose} class={styles.close}>
                <span class='material-symbols-outlined'>
                    close
                </span>
            </button>
        </div>
        <div class={styles.tooltipContent} ref={contentRef}>
            Loading...
        </div>
    </div>;

    const controller = new AbortController();
    const signal = controller.signal;
    fetch(`${apiUrl('team-stats')}?id=${props.teamId}`, { signal }).then(data =>
        data.json().then(j => contentRef.current?.replaceChildren(<IndicatorsCardGroup props={{ cards: getTeamCards(j) }} />))
    )
        .catch(err => contentRef.current && (contentRef.current.innerText = err.message));

    props.onunload = () => {
        controller.abort();
    };

    return e;
}

export default TeamCardsTooltip;
