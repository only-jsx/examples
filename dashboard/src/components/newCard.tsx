import * as styles from './newCard.module.css';

export interface NewCardProps {
    title: string;
    count: number;
    bg: number;
}

const bgColors: [[string, string], [string, string]][] = [
    [
        ['#CEDFFE', '#F4F7FE'],
        ['#CDDCFE', '#E6EEFE'],
    ],
    [
        ['#CEEEFE', '#F4FCFE'],
        ['#CDEDFE', '#E1F8FE'],
    ],
    [
        ['#DECEFE', '#F8F7FE'],
        ['#E1CDFE', '#EDEAFE'],
    ],
];

const bgSvg = (
    colors: [string, string]
) => `<svg width="280" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M 0 100 L 280 0 v 100 H 0 Z" fill="url(#lg0)"/>
<defs>
<linearGradient id="lg0" x1="280" y1="100" x2="180" y2="0" gradientUnits="userSpaceOnUse">
<stop stop-color="${colors[0]}"/>
<stop offset="1" stop-color="${colors[1]}"/>
</linearGradient>
</defs>
</svg>`;

const bgInnerSvg = (
    colors: [string, string]
) => `<svg width="196" height="70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M 0 70 L 196 0 v 70 H 0 Z" fill="url(#lg0)"/>
<defs>
<linearGradient id="lg0" x1="196" y1="70" x2="126" y2="0" gradientUnits="userSpaceOnUse">
<stop stop-color="${colors[0]}"/>
<stop offset="1" stop-color="${colors[1]}"/>
</linearGradient>
</defs>
</svg>`;

const NewCard = (props: NewCardProps): HTMLElement => {
    const bgi = props.bg % bgColors.length || 0;
    const styleCard = `--before-bg-image: url('data:image/svg+xml;base64,${btoa(
        bgInnerSvg(bgColors[bgi][1]))}')`;
    const styleContainer =  `background-image: url('data:image/svg+xml;base64,${btoa(
        bgSvg(bgColors[bgi][0]))}')`;

    return <div class={styles.card} style={styleCard}>
        <div class={styles.container} style={styleContainer}>
            {props.title}
            <span class={styles.counter}>{props.count}</span>
        </div>
    </div>;
};

export default NewCard;
