// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// redux
import { store, persistor } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
//
import { AuthProvider } from './contexts/JWTContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoadingScreen from './components/LoadingScreen';
// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <StrictMode>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <HelmetProvider>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </HelmetProvider>
        </PersistGate>
      </ReduxProvider>
    </StrictMode>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
