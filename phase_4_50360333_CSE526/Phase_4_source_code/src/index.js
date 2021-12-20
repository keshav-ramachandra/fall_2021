import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

//, getOrganizationName, getOrganizationNormalTime, getOrganizationPremiumTime, getOrganizationNormalFee, getOrganizationPremiumFee, getUserEndSubscriptionTime, getPremiumUserEndSubscriptionTime, doesUserHasNormalAccess, doesUserHasPremiumAccess, getTokenBalance, buyNormalSubscription, buyPremiumSubscription, setOrChangeSubscriptionFee, setOrChangePremiumSubscriptionFee, registerAsOrganization
import { getCurrentOrg } from './features/OrgUpdater/OrgSlice'


store.dispatch(getCurrentOrg())
//store.dispatch(getNodeAsync())
//store.dispatch(getBalanceAsync(store.getState.currentNode))

//store.dispatch(updateNodeStats())
//store.dispatch(getDepositStatusAsync())
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
