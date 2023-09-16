import App from './App';

window.onload = () => {
    const root = document.getElementById('root');
    root!.replaceChildren(<App />);
}