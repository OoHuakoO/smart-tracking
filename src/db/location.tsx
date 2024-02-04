import { LocationData } from '@src/typings/asset';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableLocation = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS location(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_location_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table location created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create location table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableLocation error:', error);
        },
        () => {
            console.log(
                'Transaction createTableLocation completed successfully'
            );
        }
    );
};

export const insertLocationData = (
    db: SQLiteDatabase,
    locations: LocationData[]
) => {
    const queryInsert =
        `INSERT INTO location (
            asset_location_id,
            name
        ) VALUES ` +
        locations
            .map(
                (item) =>
                    `(
                  ${item.asset_location_id},
                 '${item.name}'
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All locations inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting locations: ${err.message}`);
    }
};
