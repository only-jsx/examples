import styles from './tooltip.module.css';

interface TooltipProps {
    title: string;
    onunload?: () => void;
}

function buildNodes(content: string, className: string) {
    const temporaryDOM = new DOMParser().parseFromString(content, 'text/html');
    return <div class={className}>{temporaryDOM.body.childNodes}</div>;
}

function setPosition(element: HTMLDivElement, mouseTop: number, mouseLeft: number) {

    const CURSOR_SIZE = 32;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const plateHeight = element.clientHeight;
    const plateWidth = element.clientWidth;

    const top = mouseTop + plateHeight + CURSOR_SIZE >= windowHeight ?
        mouseTop - plateHeight - CURSOR_SIZE :
        mouseTop + CURSOR_SIZE;

    const left = mouseLeft + plateWidth >= windowWidth ?
        mouseLeft - plateWidth :
        mouseLeft;

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

const Tooltip = ({ props, children }: { props: TooltipProps, children?: any }) => {
    let focused = false;
    let timeoutId: NodeJS.Timeout;
    let opacityTimeoutId: NodeJS.Timeout;
    let element: HTMLDivElement | undefined;
    const mousePos = { top: 0, left: 0 };

    const dispose = () => {
        if (element && document.body.contains(element)) {
            document.body.removeChild(element);
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }

        if (opacityTimeoutId) {
            clearTimeout(opacityTimeoutId);
            opacityTimeoutId = undefined;
        }

        element = undefined;
    };

    function onMouseLeave(event?: MouseEvent) {
        dispose();
    }

    function setFocus(focus: boolean) {
        focused = focus;
        onMouseLeave();
    }

    function onMouseEnter(event: MouseEvent) {
        if (focused || timeoutId) {
            return;
        }

        timeoutId = setTimeout(
            () => {
                element = buildNodes(props.title || '', styles.content);
                setPosition(element, mousePos.top, mousePos.left);

                document.body.appendChild(element);

                opacityTimeoutId = setTimeout(() => { element && (element.style.opacity = '1'); }, 0);
            },
            700,
        );
    }

    function onMouseMove(event: MouseEvent) {
        if (focused || !timeoutId) {
            return;
        }

        mousePos.left = event.clientX;
        mousePos.top = event.clientY;

        if (element) {
            setPosition(element, event.clientY, event.clientX);
        }
    }

    props.onunload = dispose;

    return <div class={focused ? '' : styles.body}
        onfocus={() => setFocus(true)}
        onblur={() => setFocus(false)}
        onclick={onMouseLeave}
        onmouseleave={onMouseLeave}
        onmouseenter={onMouseEnter}
        onmousemove={onMouseMove}>
        {children}
    </div>
};

export default Tooltip;