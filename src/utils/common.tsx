import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    MOVEMENT_ASSET,
    MOVEMENT_ASSET_EN,
    REPORT_TYPE,
    STATE_DOCUMENT_NAME,
    STATE_DOCUMENT_VALUE
} from '@src/constant';

export const getOnlineMode = async (): Promise<boolean> => {
    const online = await AsyncStorage.getItem('Online');
    const onlineValue = JSON.parse(online);
    return onlineValue;
};

export const removeKeyEmpty = (obj: object) => {
    if (obj === undefined || obj === null) {
        return null;
    }
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
        }
    });

    if (Object.keys(obj).length === 0) {
        return null;
    }

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

export const handleMapMovementStateEN = (state: string): string => {
    switch (state) {
        case MOVEMENT_ASSET.Normal:
            return MOVEMENT_ASSET_EN.Normal;
        case MOVEMENT_ASSET.New:
            return MOVEMENT_ASSET_EN.New;
        case MOVEMENT_ASSET.Transfer:
            return MOVEMENT_ASSET_EN.Transfer;
        default:
            return MOVEMENT_ASSET_EN.Normal;
    }
};

export const handleMapReportStateValue = (
    report: string
): string | string[] => {
    switch (report) {
        case REPORT_TYPE.New:
            return MOVEMENT_ASSET.New;
        case REPORT_TYPE.Transfer:
            return MOVEMENT_ASSET.Transfer;
        case REPORT_TYPE.Found:
            return [
                MOVEMENT_ASSET.Normal,
                MOVEMENT_ASSET.New,
                MOVEMENT_ASSET.Transfer
            ];
        default:
            return [
                MOVEMENT_ASSET.Normal,
                MOVEMENT_ASSET.New,
                MOVEMENT_ASSET.Transfer
            ];
    }
};

export const handleMapDocumentStateValue = (state: string): string => {
    switch (state) {
        case STATE_DOCUMENT_VALUE.Draft:
            return STATE_DOCUMENT_NAME.Draft;
        case STATE_DOCUMENT_VALUE.Check:
            return STATE_DOCUMENT_NAME.Check;
        case STATE_DOCUMENT_VALUE.Done:
            return STATE_DOCUMENT_NAME.Done;
        case STATE_DOCUMENT_VALUE.Cancel:
            return STATE_DOCUMENT_NAME.Cancel;
        default:
            return STATE_DOCUMENT_NAME.Draft;
    }
};

export const handleMapDocumentStateName = (
    state: string
): string | string[] => {
    switch (state) {
        case STATE_DOCUMENT_NAME.Draft:
            return STATE_DOCUMENT_VALUE.Draft;
        case STATE_DOCUMENT_NAME.Check:
            return STATE_DOCUMENT_VALUE.Check;
        case STATE_DOCUMENT_NAME.Cancel:
            return STATE_DOCUMENT_VALUE.Cancel;
        case STATE_DOCUMENT_NAME.DocumentDownload:
            return [STATE_DOCUMENT_VALUE.Draft, STATE_DOCUMENT_VALUE.Check];
        default:
            return [
                STATE_DOCUMENT_VALUE.Draft,
                STATE_DOCUMENT_VALUE.Check,
                STATE_DOCUMENT_VALUE.Cancel
            ];
    }
};
