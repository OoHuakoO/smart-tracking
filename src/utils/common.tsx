import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOVEMENT_ASSET, MOVEMENT_ASSET_EN } from '@src/constant';

export const getOnlineMode = async (): Promise<boolean> => {
    const online = await AsyncStorage.getItem('Online');
    const onlineValue = JSON.parse(online);
    return onlineValue;
};

export const removeKeyEmpty = (obj: object) => {
    if (obj === undefined || obj === null) {
        return undefined;
    }
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
        }
    });

    return obj;
};

export const handleMapMovementStateValue = (state: string): string => {
    switch (state) {
        case MOVEMENT_ASSET_EN.Normal:
            return MOVEMENT_ASSET.Normal;
        case MOVEMENT_ASSET_EN.Transfer:
            return MOVEMENT_ASSET.Transfer;
        case MOVEMENT_ASSET_EN.New:
            return MOVEMENT_ASSET.New;
        default:
            return MOVEMENT_ASSET.Normal;
    }
};
