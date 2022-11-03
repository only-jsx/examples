import DoubleIndicatorsCard, { DoubleIndicatorsCardProps } from './components/doubleIndicatorsCard';
import IndicatorsCardGroup, { IndicatorsCardsProps } from './components/indicatorsCardsGroup';
import NewCardsGroup, { NewCardsGroupProps } from './components/newCardsGroup';
import TeamCardsGroup, { TeamCard, TeamCardsGroupProps } from './components/teamCardsGroup';
import { apiUrl } from './config';

export interface AppProps {
    onunload?: ()=>void;
    replace: (e: DocumentFragment)=>void
}

interface Stats {
    newcards?: NewCardsGroupProps;
    teamProducts?: TeamCard[];
    solutions?: DoubleIndicatorsCardProps;
    cards?: IndicatorsCardsProps[];
}

const getStatsInfo = (stats: any): Stats => {
    const newcards: NewCardsGroupProps = {
        days: stats.news.days,
        cards: [
            {
                title: 'Solutions',
                count: stats.news.solutions,
                bg: 0,
            },
            {
                title: 'Products',
                count: stats.news.products,
                bg: 1,
            },
            {
                title: 'Components',
                count: stats.news.components,
                bg: 2,
            },
        ],
    };

    const teamProducts: TeamCard[] = stats.teamProducts;

    const solutions: DoubleIndicatorsCardProps = {
        title: 'Type',
        head: {
            title: 'Solutions',
            image: 'lightbulb',
        },
        indicators: stats.solutions,
    };

    const cards: IndicatorsCardsProps[] = [
        {
            image: 'thumb_up',
            title: 'Products',
            info: {
                title: 'Status',
                indicators: stats.productsByStatus.map((c: any) => ({ name: c.status, count: c.count })),
            }
        },
        {
            info: {
                title: 'Type',
                indicators: stats.productsByType.map((c: any) => ({ name: c.type, count: c.count })),
            }
        },
        {
            image: 'grid_view',
            title: 'Components',
            info: {
                title: 'Status',
                indicators: stats.componentsByStatus.map((c: any) => ({ name: c.status, count: c.count })),
            }
        },
    ];

    return { newcards, teamProducts, solutions, cards };
};

const App = ({props}: {props: AppProps}): DocumentFragment => {

    const e: DocumentFragment = <><p>Loading...</p></>;

    const controller = new AbortController();
    const signal = controller.signal;

    let teamProps: TeamCardsGroupProps;

    fetch(apiUrl('stats'), { signal }).then(data => {

        data.json().then(payload => {

            if (payload) {
                const { newcards, solutions, teamProducts, cards } = getStatsInfo(payload);
                teamProps  = {teamProducts};
                props.replace(<>
                    {newcards && <NewCardsGroup props={newcards} />}
                    {solutions && <DoubleIndicatorsCard props={solutions} />}
                    {teamProducts && <TeamCardsGroup props={teamProps} />}
                    {cards && <IndicatorsCardGroup props={{cards}} />}
                </>);

                return;
            }

            (e.firstChild as HTMLElement).innerText = 'No data';
        });
    }).catch(err => (e.firstChild as HTMLElement).innerText = err.message);

    props.onunload = () => {
        controller.abort();
        teamProps.onunload?.();
    };

    return e;
};

export default App;