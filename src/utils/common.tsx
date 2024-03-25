import AsyncStorage from '@react-native-async-storage/async-storage';

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
