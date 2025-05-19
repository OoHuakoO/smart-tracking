import { DocumentAssetData } from '@src/typings/document';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableDocumentLine = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS documentLineOffline(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            category_id INTEGER,
            location_id INTEGER,
            location_old TEXT,
            location TEXT,
            state TEXT,
            use_state TEXT,
            use_state_code INTEGER,
            image TEXT,
            new_img BOOLEAN,
            is_cancel BOOLEAN DEFAULT FALSE,
            is_sync_odoo BOOLEAN DEFAULT FALSE,
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
            console.log(
                'Transaction createTableDocumentLineOffline error:',
                error
            );
        },
        () => {
            console.log(
                'Transaction createTableDocumentLineOffline completed successfully'
            );
        }
    );
};

export const insertDocumentLineData = (
    db: SQLiteDatabase,
    documentLine: DocumentAssetData[]
) => {
    const queryInsert =
        `INSERT INTO documentLineOffline (
          tracking_id,
          code,
          name,
          category,
          category_id,
          location_id,
          location_old,
          location,
          state,
          use_state,
          use_state_code,
          image,
          new_img,
          is_sync_odoo
        ) VALUES ` +
        documentLine
            .map(
                (item) => `(
                ${item.tracking_id},
                '${item.code}',
                '${item.name}',
                '${item.category}',
                 ${item.category_id},
                 ${item.location_id},
                '${item.location_old}',
                '${item.location}',
                '${item.state}',
                '${item.use_state}',
                 ${item.use_state_code},
                '${item.image}',
                 ${item.new_img},
                 ${item.is_sync_odoo}
                )`
            )
            .join(',');
    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All document line inserted successfully');
    } catch (err) {
        throw new Error(
            `Error inserting document line offline: ${err.message}`
        );
    }
};

export const getDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        tracking_id?: number;
        default_code?: string;
        default_code_for_or?: string;
        location?: string;
        state?: string | string[];
        use_state?: string;
        name?: string;
        'category_id.name'?: string;
        is_cancel?: boolean;
        is_sync_odoo?: boolean;
    },
    sort?: {
        date_check?: boolean;
    },
    page: number = 1,
    limit: number = 10
): Promise<DocumentAssetData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM documentLineOffline`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`documentLineOffline.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`documentLineOffline.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.is_cancel !== undefined) {
        whereConditions.push(`documentLineOffline.is_cancel = ?`);
        queryParams.push(filters.is_cancel);
    }

    if (filters?.is_sync_odoo !== undefined) {
        whereConditions.push(`documentLineOffline.is_sync_odoo = ?`);
        queryParams.push(filters.is_sync_odoo);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`documentLineOffline.category = ?`);
        queryParams.push(filters['category_id.name']);
    }

    if (
        filters?.name !== undefined ||
        filters?.default_code_for_or !== undefined
    ) {
        const nameOrCodeConditions = [];
        if (filters?.name !== undefined) {
            nameOrCodeConditions.push(`documentLineOffline.name LIKE ?`);
            queryParams.push(`%${filters.name}%`);
        }
        if (filters?.default_code_for_or !== undefined) {
            nameOrCodeConditions.push(`documentLineOffline.code LIKE ?`);
            queryParams.push(`%${filters.default_code_for_or}%`);
        }
        whereConditions.push(`(${nameOrCodeConditions.join(' OR ')})`);
    }

    if (filters?.state !== undefined) {
        if (Array.isArray(filters.state)) {
            const statePlaceholders = filters.state.map(() => '?').join(', ');
            whereConditions.push(
                `documentLineOffline.state IN (${statePlaceholders})`
            );
            queryParams.push(...filters.state);
        } else {
            whereConditions.push(`documentLineOffline.state = ?`);
            queryParams.push(filters.state);
        }
    }

    if (filters?.tracking_id !== undefined) {
        whereConditions.push(`documentLineOffline.tracking_id = ?`);
        queryParams.push(filters.tracking_id);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`documentLineOffline.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }
    if (sort?.date_check) {
        query += ` ORDER BY date_check DESC`;
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
        throw new Error(
            `Error retrieving document line offline: ${err.message}`
        );
    }
};

export const getTotalDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        tracking_id?: number;
        location?: string;
        state?: string | string[];
        use_state?: string;
        default_code?: string;
        default_code_for_or?: string;
        name?: string;
        'category_id.name'?: string;
        is_cancel?: boolean;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM documentLineOffline`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.tracking_id !== undefined) {
        whereConditions.push(`documentLineOffline.tracking_id = ?`);
        queryParams.push(filters.tracking_id);
    }

    if (filters?.location !== undefined) {
        whereConditions.push(`documentLineOffline.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.state !== undefined) {
        if (Array.isArray(filters.state)) {
            const statePlaceholders = filters.state.map(() => '?').join(', ');
            whereConditions.push(
                `documentLineOffline.state IN (${statePlaceholders})`
            );
            queryParams.push(...filters.state);
        } else {
            whereConditions.push(`documentLineOffline.state = ?`);
            queryParams.push(filters.state);
        }
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`documentLineOffline.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.is_cancel !== undefined) {
        whereConditions.push(`documentLineOffline.is_cancel = ?`);
        queryParams.push(filters.is_cancel);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`documentLineOffline.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`documentLineOffline.category = ?`);
        queryParams.push(filters['category_id.name']);
    }

    if (
        filters?.name !== undefined ||
        filters?.default_code_for_or !== undefined
    ) {
        const nameOrCodeConditions = [];
        if (filters?.name !== undefined) {
            nameOrCodeConditions.push(`documentLineOffline.name LIKE ?`);
            queryParams.push(`%${filters.name}%`);
        }
        if (filters?.default_code_for_or !== undefined) {
            nameOrCodeConditions.push(`documentLineOffline.code LIKE ?`);
            queryParams.push(`%${filters.default_code_for_or}%`);
        }
        whereConditions.push(`(${nameOrCodeConditions.join(' OR ')})`);
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
            `Error calculating total document line offline :  ${err.message}`
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

    if (documentLine.is_cancel !== undefined) {
        setClauses.push(`is_cancel = ?`);
        queryParams.push(documentLine.is_cancel);
    }

    if (documentLine.code !== undefined) {
        whereConditions.push(`code = ?`);
        queryParams.push(documentLine.code);
    }

    if (documentLine.tracking_id !== undefined) {
        whereConditions.push(`tracking_id = ?`);
        queryParams.push(documentLine.tracking_id);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const queryUpdate = `UPDATE documentLineOffline SET ${setClauses.join(
        ', '
    )} ${whereClause}`;

    try {
        db.transaction((tx) => {
            tx.executeSql(
                queryUpdate,
                queryParams,
                () => {
                    console.log('Updated document line successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while updated the document line:',
                        error
                    );
                    throw new Error(
                        `Failed to updated document line : ${error.message}`
                    );
                }
            );
        });
        console.log('Document line updated successfully');
    } catch (err) {
        throw new Error(`Error updating document line: ${err.message}`);
    }
};

export const removeDocumentLineOffline = (db: SQLiteDatabase) => {
    const deleteQuery = `DELETE FROM documentLineOffline`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery);
        });
        console.log(`remove document line successfully`);
    } catch (err) {
        throw new Error(`Error remove document : ${err.message}`);
    }
};

export const removeDocumentLineOfflineByTrackingID = (
    db: SQLiteDatabase,
    tracking_id: number
) => {
    const deleteQuery = `DELETE FROM documentLineOffline WHERE tracking_id = ?`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery, [tracking_id]);
        });
        console.log(
            `remove document line tracking_id: ${tracking_id} successfully`
        );
    } catch (err) {
        throw new Error(`Error remove document line : ${err.message}`);
    }
};
