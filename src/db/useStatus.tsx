import { UseStatusData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableUseStatus = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS useStatus(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            use_status_id INTEGER NOT NULL UNIQUE,
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
         use_status_id,
         name
    ) VALUES ` +
        useStatuses
            .map(
                (item) =>
                    `(
                 ${item.id},
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

export const getUseStatus = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<UseStatusData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM useStatus`;

    const queryParams = [];

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const useStatus = [];

        if (results?.length > 0) {
            for (let i = 0; i < results[0]?.rows?.length; i++) {
                useStatus.push(results[0]?.rows?.item(i));
            }
        }
        return useStatus;
    } catch (err) {
        throw new Error(`Error retrieving useStatus: ${err.message}`);
    }
};
