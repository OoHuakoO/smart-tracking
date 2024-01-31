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
