import Message, { MessageProps } from './components/Message';
import AppField from './components/AppField';
import AppButton from './components/AppButton';
import SelectYears, { SelectYearsState } from './components/SelectYears';
import CheckBox from './components/AppCheckBox';
import classes from './App.module.css';

export interface FormState {
    multiplier?: string;
    divider?: string;
    values: Array<Array<string>>;
    checked: boolean;
    message?: MessageProps;
}

const nowYear = new Date().getFullYear();
const years = [nowYear - 2, nowYear - 1, nowYear, nowYear + 1, nowYear + 2];
const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
];

const fetchRequest: RequestInit = {
    mode: 'same-origin', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

async function postForm(formData: URLSearchParams, apiPath: string) {
    const request: RequestInit = {
        ...fetchRequest,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: formData.toString(), // body data type must match 'Content-Type' header
    };

    const response = await fetch(apiPath, request);

    if (response.ok) {
        return response.text();
    } else {
        let text = await response.text();
        if (!text) {
            text = response.statusText;
        }
        throw new Error(text);
    }
}

function addValueToFormData(
    name: string,
    sr: string | undefined | null,
    fd: URLSearchParams
) {
    if (sr === null || sr === undefined) {
        fd.append(name, '');
        return true;
    }

    const k = Number(sr.replace(',', '.'));

    if (isFinite(k)) {
        fd.append(name, String(k));
        return true;
    }

    return false;
}

const selectYearsState: SelectYearsState = { isOpened: false, selected: [nowYear] };

const formState: FormState = {
    multiplier: '',
    divider: '',
    values: [],
    checked: false,
};

for (let i = 0; i < years.length; ++i) {
    formState.values[i] = new Array(12).fill('');
}

function start() {
    const formData: URLSearchParams = new URLSearchParams();;

    if (!addValueToFormData('multiplier', formState.multiplier, formData)) {
        throw new Error('Wrong multiplier');
    }

    if (!addValueToFormData('divider', formState.divider, formData)) {
        throw new Error('Wrong divider');
    }

    selectYearsState.selected.forEach((y, i) => {
        formData.append('year' + (i + 1), String(y));

        const iy = years.indexOf(y);

        formState.values[iy].forEach((r, m) => {
            if (!addValueToFormData('values' + (i + 1), r, formData)) {
                throw new Error(`Wrong value for year ${y} month ${m + 1}`);
            }
        });
    });

    return postForm(formData, '/calc/api/start');
}

export default () => {
    const initMessage: MessageProps = { type: 'none', text: '', title: '' };
    const section: { current?: HTMLDivElement } = {};
    const actions: { current?: HTMLDivElement } = {};

    function updateStart() {
        (actions.current?.lastChild as HTMLButtonElement).disabled = !formState.multiplier || !formState.divider || !formState.checked;
    }

    const onCheck = (c: boolean) => {
        formState.checked = c;
        updateStart();
    };

    const onChangeM = (sr: string) => {
        const mul = Number(sr.replace(',', '.'));

        if (isFinite(mul) && mul >= 0 && mul <= 1000) {
            formState.multiplier = sr;
        }

        updateStart();
        return formState.multiplier;
    };

    const onChangeD = (sr: string) => {
        const div = Number(sr.replace(',', '.'));

        if (isFinite(div) && div >= 0 && div <= 1000) {
            formState.divider = sr;
        }

        updateStart();
        return formState.divider;
    };

    function onChangeValue(
        k: Array<Array<string | null>>,
        iy: number,
        month: number,
        sv: string
    ) {
        const r = Number(sv.replace(',', '.'));

        if (isFinite(r) && r >= 0 && r <= 1000) {
            k[iy][month] = sv;
        }

        return k[iy][month];
    }

    function setMessage(message: MessageProps) {
        if (formState.message) {
            actions.current?.children[1].remove();
        }

        if (message) {
            actions.current?.insertBefore(<Message {...message} onKeyDown={onMessageKeyDown} onClick={() => setMessage(initMessage)} />, actions.current?.lastChild);
        }

        formState.message = message;
    }

    async function onStart() {
        setMessage({
            type: 'info',
            text: 'Calculating...',
            title: 'Message',
        });

        const title = 'Calculation result';

        try {
            const r = await start();
            setMessage({ type: 'info', text: r, title });
        }
        catch (e: any) {
            const text = e instanceof Error ? e.message : e.toString();

            setMessage({ type: 'error', text, title });
        }
    }

    function onMessageKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
            case 'Escape':
                setMessage(initMessage);
                event.stopPropagation();
                break;
        }
    }

    function setSelectedYears(selected: number[]) {
        while (section.current?.children?.length as number > 3) {
            section.current?.lastChild?.remove();
        }

        if (selected.length) {
            if (section.current?.children?.length as number < 3) {
                section.current?.append(<h2 class={classes.head2}>Month values</h2>);
            }

            const yearRows = selected.map((y: number) => {
                const iy = years.indexOf(y);
                if (iy < 0) {
                    return undefined;
                }

                return <div class={classes.itemsRow}>
                    {months.map((m, im) => {
                        return <AppField
                            id={'value-' + m}
                            placeholder={m + '.' + (y % 100)}
                            title={m + '.' + (y % 100)}
                            value={formState.values[iy][im]}
                            onChange={(v: string) => onChangeValue(formState.values, iy, im, v)}
                        />;
                    })}
                </div>;
            });

            section.current?.append(...yearRows);
        } else {
            section.current?.lastChild?.remove();
        }
    }

    return <div>
        <div class={classes.header}>
            <div>Calculation Form</div>
            <div style='width: 300px'>
                <SelectYears id='years' years={years} onChanged={setSelectedYears} state={selectYearsState} />
            </div>
        </div>
        <div class={classes.section} ref={section}>
            <h2 class={classes.head2}>Global factors</h2>
            <div class={classes.itemsRow}>
                <div class={classes.itemsColumn2}>
                    <AppField
                        id='multiplier'
                        placeholder='Multiplier'
                        title='Multiplier'
                        value={formState.multiplier}
                        onChange={onChangeM}
                    />
                </div>
                <div class={classes.itemsColumn2}>
                    <AppField
                        id='divider'
                        placeholder='Divider'
                        title='Divider'
                        value={formState.divider}
                        onChange={onChangeD}
                    />
                </div>
            </div>
            <h2 class={classes.head2}>Month values</h2>
            <div class={classes.itemsRow}>
                {months.map((m, im) =>
                    <AppField
                        id={'value-' + m}
                        placeholder={m + '.' + (nowYear % 100)}
                        title={m + '.' + (nowYear % 100)}
                        value={formState.values[2][im]}
                        onChange={(v: string) => onChangeValue(formState.values, 2, im, v)}
                    />
                )}
            </div>
        </div>
        <div class={classes.actions} ref={actions}>
            <CheckBox id='enable-calc' checked={formState.checked} onChange={onCheck}>Enable calculation</CheckBox>
            <AppButton
                isDisabled={true}
                onclick={onStart}
            >Start calculation</AppButton>
        </div>
    </div>;
};
