import { DocumentData } from '@src/typings/document';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableDocumentOnline = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS documentOnline(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id INTEGER NOT NULL,
            state TEXT
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table documentOnline created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create documentOnline table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableDocumentOnline error:', error);
        },
        () => {
            console.log(
                'Transaction createTableDocumentOnline completed successfully'
            );
        }
    );
};

export const insertDocumentOnlineData = (
    db: SQLiteDatabase,
    documents: DocumentData[]
) => {
    const queryInsert =
        `INSERT INTO documentOnline (
          tracking_id,
          state
        ) VALUES ` +
        documents
            .map(
                (item) => `(
                 ${item.id},
                '${item.state}'
               )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All documentOnline inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting documentOnline: ${err.message}`);
    }
};

export const getDocumentOnline = async (
    db: SQLiteDatabase,
    filters?: {
        state?: string;
        'location_id.name'?: string;
        tracking_id?: number;
    },
    page: number = 1,
    limit: number = 10
): Promise<DocumentData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM documentOnline`;
    const queryParams = [];
    const whereConditions = [];

    if (filters && filters['location_id.name'] !== undefined) {
        whereConditions.push(`documentOnline.location LIKE ?`);
        queryParams.push(`%${filters['location_id.name']}%`);
    }

    if (filters?.state !== undefined) {
        whereConditions.push(`documentOnline.state = ?`);
        queryParams.push(filters.state);
    }

    if (filters?.tracking_id !== undefined) {
        whereConditions.push(`documentOnline.tracking_id = ?`);
        queryParams.push(filters.tracking_id);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

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
