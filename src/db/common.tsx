import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const clearDataAllTable = (db: SQLiteDatabase) => {
    try {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM asset;');
            tx.executeSql('DELETE FROM location;');
            tx.executeSql('DELETE FROM useStatus;');
            tx.executeSql('DELETE FROM category;');
            tx.executeSql('DELETE FROM documentOffline;');
            tx.executeSql('DELETE FROM documentLineOffline;');
            tx.executeSql('DELETE FROM userOffline');
            tx.executeSql('DELETE FROM reportAssetNotFound;');
            tx.executeSql('DELETE FROM branch');
        });
        console.log('Data deleted from all tables successfully');
    } catch (err) {
        throw new Error(`Error deleting data from tables: ${err.message}`);
    }
};

export const dropAllTable = (db: SQLiteDatabase) => {
    try {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS asset;');
            tx.executeSql('DROP TABLE IF EXISTS location;');
            tx.executeSql('DROP TABLE IF EXISTS useStatus;');
            tx.executeSql('DROP TABLE IF EXISTS category;');
            tx.executeSql('DROP TABLE IF EXISTS documentOffline');
            tx.executeSql('DROP TABLE IF EXISTS documentLineOffline');
            tx.executeSql('DROP TABLE IF EXISTS userOffline');
            tx.executeSql('DROP TABLE IF EXISTS reportAssetNotFound');
            tx.executeSql('DROP TABLE IF EXISTS branch');
        });
        console.log('Drop all table successfully');
    } catch (err) {
        throw new Error(`Error drop all table: ${err.message}`);
    }
};

// master table mean table collect data from download on odoo api
// dropAllMasterTable use for drop table before download data from odoo

export const dropAllMasterTable = (db: SQLiteDatabase) => {
    try {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS asset;');
            tx.executeSql('DROP TABLE IF EXISTS location;');
            tx.executeSql('DROP TABLE IF EXISTS useStatus;');
            tx.executeSql('DROP TABLE IF EXISTS category;');
            tx.executeSql('DROP TABLE IF EXISTS documentOffline');
            tx.executeSql('DROP TABLE IF EXISTS documentLineOffline');
            tx.executeSql('DROP TABLE IF EXISTS reportAssetNotFound');
            tx.executeSql('DROP TABLE IF EXISTS userOffline');
            tx.executeSql('DROP TABLE IF EXISTS branch');
        });
        console.log('Drop master table successfully');
    } catch (err) {
        throw new Error(`Error drop master table: ${err.message}`);
    }
};
