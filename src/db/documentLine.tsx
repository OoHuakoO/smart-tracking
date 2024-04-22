import { DocumentAssetData } from '@src/typings/document';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableDocumentLine = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS documentLine(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id INTEGER NOT NULL,
            document_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            location_id INTEGER,
            location_old TEXT,
            location TEXT,
            state TEXT,
            use_state TEXT,
            use_state_code INTEGER,
            image TEXT,
            new_img BOOLEAN,
            date_check DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime'))
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
            console.log('Transaction createTableDocumentLine error:', error);
        },
        () => {
            console.log(
                'Transaction createTableDocumentLine completed successfully'
            );
        }
    );
};

export const insertDocumentLineData = (
    db: SQLiteDatabase,
    documentLine: DocumentAssetData[]
) => {
    const queryInsert =
        `INSERT INTO documentLine (
          asset_id,
          document_id,
          code,
          name,
          category,
          location_id,
          location_old,
          location,
          state,
          use_state,
          use_state_code,
          image,
          new_img
        ) VALUES ` +
        documentLine
            .map(
                (item) => `(
                ${item.asset_id},
                ${item.document_id},
                '${item.code}',
                '${item.name}',
                '${item.category}',
                 ${item.location_id},
                '${item.location_old}',
                '${item.location}',
                '${item.state}',
                '${item.use_state}',
                 ${item.use_state_code},
                '${item.image}',
                 ${item.new_img}
                )`
            )
            .join(',');
    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All document line inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting document line: ${err.message}`);
    }
};

export const getDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        document_id?: number;
        default_code?: string;
    },
    page: number = 1,
    limit: number = 10
): Promise<DocumentAssetData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM documentLine`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.document_id !== undefined) {
        whereConditions.push(`documentLine.document_id = ?`);
        queryParams.push(filters.document_id);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`documentLine.code = ?`);
        queryParams.push(filters.default_code);
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
        throw new Error(`Error retrieving document line: ${err.message}`);
    }
};

export const getTotalDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        document_id?: number;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM documentLine`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.document_id !== undefined) {
        whereConditions.push(`documentLine.document_id = ?`);
        queryParams.push(filters.document_id);
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
        throw new Error(
            `Error calculating total document line :  ${err.message}`
        );
    }
};

export const updateDocumentLineData = (
    db: SQLiteDatabase,
    documentLine: DocumentAssetData
) => {
    const setClauses = [];
    const queryParams = [];
    const whereConditions = [];

    if (documentLine.use_state !== undefined) {
        setClauses.push(`use_state = ?`);
        queryParams.push(documentLine.use_state);
    }

    if (documentLine.use_state_code !== undefined) {
        setClauses.push(`use_state_code = ?`);
        queryParams.push(documentLine.use_state_code);
    }

    if (documentLine.image !== undefined) {
        setClauses.push(`image = ?`);
        queryParams.push(documentLine.image);
    }

    if (documentLine.new_img !== undefined) {
        setClauses.push(`new_img = ?`);
        queryParams.push(documentLine.new_img ? 1 : 0);
    }

    if (documentLine.asset_id_update !== undefined) {
        setClauses.push(`asset_id = ?`);
        queryParams.push(documentLine.asset_id_update);
    }

    if (documentLine.asset_id !== undefined) {
        whereConditions.push(`asset_id = ?`);
        queryParams.push(documentLine.asset_id);
    }

    if (documentLine.code !== undefined) {
        whereConditions.push(`code = ?`);
        queryParams.push(documentLine.code);
    }

    if (documentLine.document_id !== undefined) {
        whereConditions.push(`document_id = ?`);
        queryParams.push(documentLine.document_id);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const queryUpdate = `UPDATE documentLine SET ${setClauses.join(
        ', '
    )} ${whereClause}`;

    try {
        db.transaction((tx) => {
            tx.executeSql(
                queryUpdate,
                queryParams,
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
        });
        console.log('Document line updated successfully');
    } catch (err) {
        throw new Error(`Error updating document line: ${err.message}`);
    }
};

export const removeDocumentLineByAssetId = (
    db: SQLiteDatabase,
    assetId: number
) => {
    const deleteQuery = `DELETE FROM documentLine WHERE asset_id = ?`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery, [assetId]);
        });
        console.log(`remove document line assetId: ${assetId} successfully`);
    } catch (err) {
        throw new Error(`Error remove document line: ${err.message}`);
    }
};
