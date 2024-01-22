import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-native-paper';
import { RecoilRoot } from 'recoil';
import App from './src';
import { theme } from './src/theme';
function Main() {
    return (
        <RecoilRoot>
            <Provider theme={theme}>
                <App />
            </Provider>
        </RecoilRoot>
    );
}

export default Main;
