import { DocumentData } from '@src/typings/document';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableDocument = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS document(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            state TEXT,
            location_id INTEGER,
            location TEXT,
            date_order DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table document created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create document table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableDocument error:', error);
        },
        () => {
            console.log(
                'Transaction createTableDocument completed successfully'
            );
        }
    );
};

export const insertDocumentData = (
    db: SQLiteDatabase,
    documents: DocumentData
) => {
    const queryInsert =
        `INSERT INTO document (
          state,
          location_id,
          location
        ) VALUES ` +
        `(
          '${documents.state}',
           ${documents.location_id},
          '${documents.location}'
          )`;
    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All document inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting document: ${err.message}`);
    }
};

export const getDocument = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<DocumentData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM document`;
    const queryParams = [];
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const assets = [];

        if (results?.length > 0) {
            for (let i = 0; i < results[0]?.rows?.length; i++) {
                assets.push(results[0]?.rows?.item(i));
            }
        }

        return assets;
    } catch (err) {
        throw new Error(`Error retrieving documents: ${err.message}`);
    }
};

export const getTotalWithFilterDocument = async (
    db: SQLiteDatabase
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM document`;

    try {
        const results = await db.executeSql(queryTotal);
        if (results.length > 0 && results[0].rows.length > 0) {
            return results[0].rows.item(0).total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total assets :  ${err.message}`);
    }
};

export const getTotalDocument = async (db: SQLiteDatabase): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM document`;

    try {
        const results = await db.executeSql(queryTotal);
        if (results.length > 0 && results[0].rows.length > 0) {
            return results[0].rows.item(0).total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total assets :  ${err.message}`);
    }
};
