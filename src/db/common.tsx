import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const clearDataFromMasterTable = (db: SQLiteDatabase) => {
    try {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM asset;');
            tx.executeSql('DELETE FROM location;');
            tx.executeSql('DELETE FROM useStatus;');
        });
        console.log('Data deleted from all tables successfully');
    } catch (err) {
        throw new Error(`Error deleting data from tables: ${err.message}`);
    }
};

export const dropAllMasterTable = (db: SQLiteDatabase) => {
    try {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS asset;');
            tx.executeSql('DROP TABLE IF EXISTS location;');
            tx.executeSql('DROP TABLE IF EXISTS useStatus;');
        });
        console.log('Drop master table successfully');
    } catch (err) {
        throw new Error(`Error drop master table: ${err.message}`);
    }
};