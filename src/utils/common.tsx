import AsyncStorage from '@react-native-async-storage/async-storage';

export const getOnlineMode = async (): Promise<boolean> => {
    const online = await AsyncStorage.getItem('Online');
    const onlineValue = JSON.parse(online);
    return onlineValue;
};
