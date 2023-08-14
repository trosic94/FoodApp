import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App2';  

import { createClient, Provider } from 'urql';

const client = createClient({
  url: 'https://stake.bet/_api/graphql/',
  fetchOptions: {
    headers: {
      'x-firewall-bypass': 'vH2ULEOOCVXZYWN7Su9VDHaE9SbpGUCtmfDpPEOf',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  // </React.StrictMode>
);
