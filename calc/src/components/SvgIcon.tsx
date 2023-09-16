import { setContext } from 'only-jsx/jsx-runtime';
import type { ContextFunc, OptionsChildren } from 'only-jsx/jsx-runtime';

interface SvgIconProps extends OptionsChildren {
    width: number;
    height: number;
}

const SvgContext = (props: OptionsChildren, ctx: any) => (props.children as ContextFunc)(ctx);

export default (props: SvgIconProps) => {
    setContext(SvgContext, {})
    return <SvgContext><svg xmlns='http://www.w3.org/2000/svg' width={props.width} height={props.height}>
        <path d={props.children} fill='currentColor'></path>
    </svg></SvgContext>;
}