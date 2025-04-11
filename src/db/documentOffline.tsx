import { DocumentData } from '@src/typings/document';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableDocumentOffline = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS documentOffline(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id INTEGER NOT NULL,
            name TEXT,
            state TEXT,
            location_id INTEGER,
            location TEXT,
            is_sync_odoo BOOLEAN DEFAULT FALSE,
            date_order DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime'))
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table documentOffline created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create documentOffline table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableDocumentOffline error:', error);
        },
        () => {
            console.log(
                'Transaction createTableDocumentOffline completed successfully'
            );
        }
    );
};

export const insertDocumentOfflineData = (
    db: SQLiteDatabase,
    documents: DocumentData
) => {
    const queryInsert =
        `INSERT INTO documentOffline (
          tracking_id,
          name,
          state,
          location_id,
          location
        ) VALUES ` +
        `(
           ${documents.tracking_id || documents.id},
          '${documents.name}',
          '${documents.state}',
           ${documents.location_id},
          '${documents.location}'
          )`;
    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('documentOffline inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting documentOffline: ${err.message}`);
    }
};

export const insertListDocumentOfflineData = (
    db: SQLiteDatabase,
    documents: DocumentData[]
) => {
    const queryInsert =
        `INSERT INTO documentOffline (
          tracking_id,
          name,
          state,
          location_id,
          location,
          is_sync_odoo,
          date_order
        ) VALUES ` +
        documents
            .map(
                (item) => `(
                ${item.tracking_id || item.id},
                '${item.name}',
                '${item.state}',
                ${item.location_id},
                '${item.location}',
                ${item.is_sync_odoo},
                '${item.date_order}'
                )`
            )
            .join(',');
    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('documentOffline inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting documentOffline: ${err.message}`);
    }
};

export const getDocumentOffline = async (
    db: SQLiteDatabase,
    filters?: {
        state?: string;
        'location_id.name'?: string;
        tracking_id?: number;
    },
    sort?: {
        date_order?: boolean;
    },
    page: number = 1,
    limit: number = 10
): Promise<DocumentData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM documentOffline`;
    const queryParams = [];
    const whereConditions = [];

    if (filters && filters['location_id.name'] !== undefined) {
        whereConditions.push(`documentOffline.location LIKE ?`);
        queryParams.push(`%${filters['location_id.name']}%`);
    }

    if (filters?.state !== undefined) {
        whereConditions.push(`documentOffline.state = ?`);
        queryParams.push(filters.state);
    }

    if (filters?.tracking_id !== undefined) {
        whereConditions.push(`documentOffline.tracking_id = ?`);
        queryParams.push(filters.tracking_id);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

    if (sort?.date_order) {
        query += ` ORDER BY date_order DESC`;
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

export const getTotalDocument = async (
    db: SQLiteDatabase,
    filters?: {
        state?: string;
        'location_id.name'?: string;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM documentOffline`;
    const queryParams = [];
    const whereConditions = [];

    if (filters && filters['location_id.name'] !== undefined) {
        whereConditions.push(`documentOffline.location LIKE ?`);
        queryParams.push(`%${filters['location_id.name']}%`);
    }

    if (filters?.state !== undefined) {
        whereConditions.push(`documentOffline.state = ?`);
        queryParams.push(filters.state);
    }

    if (whereConditions.length > 0) {
        queryTotal += ` WHERE ` + whereConditions.join(' AND ');
    }

    try {
        const results = await db.executeSql(queryTotal, queryParams);
        if (results.length > 0 && results[0].rows.length > 0) {
            return results[0].rows.item(0).total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total assets :  ${err.message}`);
    }
};

export const updateDocument = (db: SQLiteDatabase, document: DocumentData) => {
    const setClauses = [];
    const queryParams = [];
    const whereConditions = [];

    if (document.state !== undefined) {
        setClauses.push(`state = ?`);
        queryParams.push(document.state);
    }

    if (document.tracking_id !== undefined) {
        whereConditions.push(`tracking_id = ?`);
        queryParams.push(document.tracking_id);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const queryUpdate = `UPDATE documentOffline SET ${setClauses.join(
        ', '
    )} ${whereClause}`;

    try {
        db.transaction((tx) => {
            tx.executeSql(
                queryUpdate,
                queryParams,
                () => {
                    console.log('Table documentOffline update successfully');
                },
                (_, error) => {
                    console.log('Error occurred while update data:', error);
                    throw new Error(
                        `Failed to update documentOffline : ${error.message}`
                    );
                }
            );
        });
        console.log('Document updated successfully');
    } catch (err) {
        throw new Error(`Error updating documentOffline : ${err.message}`);
    }
};

export const removeDocumentOfflineByID = (db: SQLiteDatabase, id: number) => {
    const deleteQuery = `DELETE FROM documentOffline WHERE id = ?`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery, [id]);
        });
        console.log(`remove document id: ${id} successfully`);
    } catch (err) {
        throw new Error(`Error remove document : ${err.message}`);
    }
};

export const removeDocumentOffline = (db: SQLiteDatabase) => {
    const deleteQuery = `DELETE FROM documentOffline`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery);
        });
        console.log(`remove document successfully`);
    } catch (err) {
        throw new Error(`Error remove document : ${err.message}`);
    }
};
