import App from './App';
import { describe, expect, test } from '@jest/globals';

describe('renders App', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('with primitive children', () => {
        const app = <App />;
        expect(app instanceof HTMLDivElement).toBeTruthy();
        expect(app?.firstChild?.firstChild instanceof HTMLDivElement).toBeTruthy();
        expect(app?.firstChild?.firstChild?.textContent).toBe('Calculation Form');
    });
});