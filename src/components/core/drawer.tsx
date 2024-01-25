import * as React from 'react';
import { Drawer } from 'react-native-paper';

const DrawerMenu = () => (
    <Drawer.CollapsedItem
        focusedIcon="inbox"
        unfocusedIcon="inbox-outline"
        label="Inbox"
    />
);

export default DrawerMenu;
