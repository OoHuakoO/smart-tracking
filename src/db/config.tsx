import { enablePromise, openDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
    return openDatabase(
        { name: 'smart-tracking', location: 'default' },
        () => {
            console.log('Connect to database successfully');
        },
        (error) => {
            console.log(error);
            throw Error('Could not connect to database');
        }
    );
};
