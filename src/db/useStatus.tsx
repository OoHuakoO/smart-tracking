import { UseStatusData } from '@src/typings/asset';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableUseStatus = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS useStatus(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table useStatus created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create useStatus table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableUseStatus error:', error);
        },
        () => {
            console.log(
                'Transaction createTableUseStatus completed successfully'
            );
        }
    );
};

export const insertUseStatusData = (
    db: SQLiteDatabase,
    useStatuses: UseStatusData[]
) => {
    const queryInsert =
        `INSERT INTO useStatus (
         name
    ) VALUES ` +
        useStatuses
            .map(
                (item) =>
                    `(
                '${item.name}'
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All useStatus inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting useStatus: ${err.message}`);
    }
};
