import { DefaultTheme, configureFonts } from 'react-native-paper';
import { colorConfig } from './color';
import { fontConfig } from './font';

export const theme = {
    ...DefaultTheme,
    colors: colorConfig,
    fonts: configureFonts({ config: fontConfig })
};
