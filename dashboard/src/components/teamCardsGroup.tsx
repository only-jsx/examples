import StatHeader from './statHeader';
import styles from './teamCardsGroup.module.css';
import TeamCardsTooltip, { tooltipWidth, TeamCardsTooltipProps } from './teamCardsTooltip';

const tooltipPadding = 24;

export interface TeamCard {
    teamId: number;
    title: string;
    leader: string;
    count: number;
}

export interface TeamCardsGroupProps {
    teamProducts?: TeamCard[];
    onunload?: () => void;
}

const TeamCardsGroup = ({ props }: { props: TeamCardsGroupProps }): DocumentFragment => {
    const containerRef: { current?: HTMLElement } = {};
    let tooltipElement: HTMLElement;
    let currentTooltipTarget: HTMLElement;
    let tooltipProps: TeamCardsTooltipProps | undefined;

    const onClose = () => {
        tooltipProps.onunload?.();
        tooltipProps = undefined;
        props.onunload = undefined;
        containerRef.current.removeAttribute('style');
        if (tooltipElement) {
            containerRef.current.removeChild(tooltipElement);
            tooltipElement = undefined;
        }

        if(currentTooltipTarget)
        {
            currentTooltipTarget.className = styles.card;
            currentTooltipTarget = undefined;
        }
    }

    props.onunload = onClose;

    let total = 0;

    const cards = [[], [], []] as HTMLElement[][];

    if (props.teamProducts) {
        total = props.teamProducts.reduce((a: number, b: TeamCard) => a + b.count, 0);
        const cardCount = Math.ceil(props.teamProducts.length / 3);

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < cardCount && i * cardCount + j < props.teamProducts.length; ++j) {
                const t = props.teamProducts[i * cardCount + j];
                cards[i].push(
                    <button
                        class={styles.card}
                        onclick={(e: MouseEvent) => onTeamClick(t.teamId, e)}
                    >
                        <span class={styles.name}>{t.title}</span>
                        <span class={styles.counter}>{t.count}</span>
                        <div class={styles.leader}>{t.leader}</div>
                    </button>
                );
            }
        }
    }

    const e: DocumentFragment = <>
        <StatHeader props={{ image: 'group', title: 'Teams' }} />
        <div class={styles.container} ref={containerRef} >
            <div class={styles.title}>
                Team products
                <span class={styles.rightSpan}>Total: {total}</span>
            </div>
            <div class={styles.row}>
                {cards.map((c, i) => <div key={i} class={styles.column}>{c}</div>)}
            </div>
        </div>
    </>;

    const onTeamClick = (
        teamId: number,
        event: MouseEvent
    ) => {
        const currentTarget = event?.currentTarget as HTMLElement;
        const p = currentTarget?.parentElement?.parentElement?.parentElement;
        if (!p) {
            return;
        }

        if (tooltipProps?.teamId && tooltipProps.teamId === teamId) {
            return;
        }

        if(tooltipProps)
        {
            onClose();
            tooltipProps = undefined;
        }

        const tw = tooltipWidth + 2 * tooltipPadding;
        let left = 0;
        const maxRight = p.offsetLeft + p.offsetWidth;
        if (currentTarget.offsetLeft + currentTarget.offsetWidth / 2 + tw / 2 > maxRight) {
            left = p.offsetWidth - tw;
        }

        if (!left) {
            left = currentTarget.offsetLeft + currentTarget.offsetWidth / 2 - tw / 2;
        }

        if (left < 0) {
            left = 0;
        }

        tooltipProps = {
            teamId,
            left,
            top: currentTarget.offsetTop + currentTarget.offsetHeight + 20,
            connectionLeft:
                currentTarget.offsetLeft + currentTarget.offsetWidth / 2 - left,
            onClose,
        };

        containerRef.current.style.setProperty('--connection-left', tooltipProps.connectionLeft + 'px');
        tooltipElement = <TeamCardsTooltip props={tooltipProps} />;
        containerRef.current.appendChild(tooltipElement);

        currentTarget.className = styles.card + ' ' + styles.activeCard;

        currentTooltipTarget = currentTarget;
    };

    return e;
};

export default TeamCardsGroup;
