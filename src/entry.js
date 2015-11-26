import ReactDOM from 'react-dom';
import Provider from './provider.jsx';

let render = (id) => {
    ReactDOM.render(Provider, document.querySelector(id));
};

document.addEventListener('DOMContentLoaded', render.bind(this, '#application-mount'));