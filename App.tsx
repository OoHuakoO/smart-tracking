import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-native-paper';
import App from './src';
import {theme} from './src/theme';
function Main() {
  return (
    <Provider theme={theme}>
      <App />
    </Provider>
  );
}

export default Main;
