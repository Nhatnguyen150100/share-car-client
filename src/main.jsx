import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import ToastContainerComponent from './component/ToastContainer';
import { Provider } from 'react-redux';

import { store, persistor } from './redux/ReduxStore.jsx';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Router>
				<App />
				<ToastContainerComponent />
			</Router>
		</PersistGate>
	</Provider>,
);
