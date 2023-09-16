import classes from './SelectYears.module.css';
import CancelIcon from './CancelIcon';
import SvgIcon from './SvgIcon';

export interface SelectYearsState {
    isOpened: boolean;
    selected: number[];
}

interface SelectYearsProps {
    id?: string;
    years: number[];
    onChanged: (years: number[]) => void;
    state: SelectYearsState
}

export default (props: SelectYearsProps) => {

    const title = 'Select years';
    const dropdownId = props.id + '-list';
    const openedPath = 'M10 13L5 7L0 13H10Z';
    const actionsWidth1 = 10;
    const actionsWidth2 = 35;
    const actionsWidth = props.state.selected.length > 0 ? actionsWidth2 : actionsWidth1;
    const labelId = props.id + '-years-label';

    const selectedYears: { current?: HTMLSpanElement } = {};
    const span: { current?: HTMLSpanElement } = {};

    const main: HTMLDivElement = <div class={classes.main}
        id={props.id}
        tabIndex={0}
        onkeydown={onKeyDown}
        role='combobox'
        aria-labelledby={labelId}
        aria-controls={dropdownId}
        aria-expanded='false'>
        <label class={classes.label} id={labelId}>{title}</label>
        <span ref={selectedYears}>{props.state.selected.join()}</span>
        <span class={classes.actions} style={`width: ${actionsWidth}px`}>
            {props.state.selected.length > 0 && <span onclick={handleClear}>
                <CancelIcon />
            </span>}
            <span ref={span} onclick={handleDown} aria-haspopup='listbox'>
                <SvgIcon width={10} height={20}>{openedPath}</SvgIcon>
            </span>
        </span>
    </div>;

    function updateSelected(selected?: number[]) {
        if (selected?.length) {
            if (!selectedYears.current) {
                main.firstChild!.replaceWith(<label class={classes.label} id={labelId}>{title}</label>,
                    <span ref={selectedYears}>{props.state.selected.join()}</span>)

                span.current!.parentNode?.insertBefore(<span onclick={handleClear}>
                    <CancelIcon />
                </span>, span.current!);

                span.current!.parentElement!.style.width = actionsWidth2 + 'px';
            }

            selectedYears.current!.innerText = selected.join();
        } else {
            if (selectedYears.current) {
                delete selectedYears.current;
                // remove label
                main.firstChild!.remove();
                // remove cancel icon
                span.current!.parentNode!.firstChild?.remove();
                span.current!.parentElement!.style.width = actionsWidth1 + 'px';
            }
            
            main.firstChild!.replaceWith(<span class={classes.title} id={labelId}>{title}</span>)
        }
    }

    function handleSelect(e: MouseEvent, year: number) {
        const button = (e.currentTarget as HTMLButtonElement);

        const newSelected = props.state.selected.filter((y: number) => y !== year);

        if (newSelected.length === props.state.selected.length) {
            if (props.state.selected.length > 2) {
                const removed = props.years.indexOf(newSelected.shift() as number);
                // select checkbox
                ((main.lastChild as HTMLDivElement).children[removed].lastChild as HTMLSpanElement).classList.remove(classes.selected);
            }

            newSelected.push(year);

            (button.lastChild as HTMLSpanElement).classList.add(classes.selected);
        } else {
            (button.lastChild as HTMLSpanElement).classList.remove(classes.selected);
        }

        newSelected.sort();

        props.onChanged(newSelected);

        props.state.selected = newSelected;

        updateSelected(newSelected);
    };

    function setOpened(opened: boolean) {
        if (props.state.isOpened == opened) {
            return;
        }

        if (opened) {
            span.current!.onclick = handleUp;
            span.current!.setAttribute('aria-controls', dropdownId);
            span.current!.replaceChildren(<SvgIcon width={10} height={20}>M10 7L5 13L0 7H10Z</SvgIcon>);
            main.className = classes.main + ' ' + classes.mainFocused;
            main.setAttribute('aria-expanded', 'true');

            const dropdownList = <div class={classes.dropdown} id={dropdownId} role='listbox' aria-label='Years'>
                {props.years.map((y: number) => {
                    const selected = props.state.selected.includes(y);
                    const className = classes.checkbox + (selected ? ' ' + classes.selected : '');
                    return <button role='option' aria-selected={selected}
                        class={classes.item} onclick={(e: MouseEvent) => handleSelect(e, y)}>
                        {y}
                        <span class={className}></span>
                    </button>
                })}
            </div>;

            main.appendChild(dropdownList);
        } else {
            span.current!.removeAttribute('aria-controls');
            span.current!.onclick = handleDown;
            span.current!.replaceChildren(<SvgIcon width={10} height={20}>{openedPath}</SvgIcon>);
            main.className = classes.main;
            main.setAttribute('aria-expanded', 'false');
            main.lastChild?.remove();
        }

        props.state.isOpened = opened;
    }

    function handleClear() {
        document.removeEventListener('click', handleOutsideClick, true);

        const newSelected: number[] = [];
        setOpened(false);
        props.onChanged(newSelected);
        props.state.selected = newSelected;
        updateSelected(newSelected);
    }

    function handleUp() {
        document.removeEventListener('click', handleOutsideClick, true);
        setOpened(false);
    }

    function handleOutsideClick(evt: Event) {
        if (
            main.contains(evt.target as Node)
        ) {
            return;
        }

        handleUp();
    }

    function handleDown() {
        setOpened(true);
        document.addEventListener('click', handleOutsideClick, true);
    }

    function onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                handleDown();
                event.stopPropagation();
                break;
            case 'Escape':
                handleUp();
                main.focus();
                event.stopPropagation();
                break;
        }
    }

    return main;
};