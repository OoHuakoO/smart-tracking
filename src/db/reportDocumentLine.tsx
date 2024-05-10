import { DocumentAssetData } from '@src/typings/document';
import { ReportAssetData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableReportDocumentLine = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS reportDocumentLine (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            location_old TEXT,
            location TEXT,
            state TEXT,
            use_state TEXT,
            mode TEXT DEFAULT online
        );`;

            tx.executeSql(
                query,
                [],
                () => {
                    console.log(
                        'Table reportDocumentLine created successfully'
                    );
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create reportDocumentLine table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log(
                'Transaction createTableReportDocumentLine error:',
                error
            );
        },
        () => {
            console.log(
                'Transaction createTableReportDocumentLine completed successfully'
            );
        }
    );
};

export const insertReportDocumentLine = (
    db: SQLiteDatabase,
    documentAssetData: DocumentAssetData[]
) => {
    const queryInsert =
        `INSERT INTO reportDocumentLine (
          tracking_id,
          code,
          name,
          category,
          location_old,
          location,
          state,
          use_state,
          mode
    ) VALUES ` +
        documentAssetData
            .map(
                (item) => `(
                     ${item.tracking_id},
                    '${item.code}',
                    '${item.name}',
                    '${item.category}',
                    '${item.location_old}',
                    '${item.location}',
                    '${item.state}',
                    '${item.use_state}',
                    '${item.mode}',
                    )`
            )
            .join(',');

    try {
        db.transaction(
            (tx) => {
                tx.executeSql(queryInsert);
            },
            (error) => {
                console.log(
                    'Transaction insertReportDocumentLine error:',
                    error
                );
            },
            () => {
                console.log(
                    'Transaction insertReportDocumentLine completed successfully'
                );
            }
        );
        console.log('All reportDocumentLineData inserted successfully');
    } catch (err) {
        throw new Error(
            `Error inserting reportDocumentLineData: ${err.message}`
        );
    }
};

export const getReportDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        location?: string;
        state?: string | string[];
        use_state?: string;
        default_code?: string;
        name?: string;
        'category_id.name'?: string;
    },
    page: number = 1,
    limit: number = 10
): Promise<ReportAssetData[]> => {
    let query = `SELECT * FROM reportDocumentLine`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`reportDocumentLine.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.state !== undefined) {
        if (Array.isArray(filters.state)) {
            const statePlaceholders = filters.state.map(() => '?').join(', ');
            whereConditions.push(
                `reportDocumentLine.state IN (${statePlaceholders})`
            );
            queryParams.push(...filters.state);
        } else {
            whereConditions.push(`reportDocumentLine.state = ?`);
            queryParams.push(filters.state);
        }
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`reportDocumentLine.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`reportDocumentLine.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (filters?.name !== undefined) {
        whereConditions.push(`reportDocumentLine.code = ?`);
        queryParams.push(filters.name);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`reportDocumentLine.category = ?`);
        queryParams.push(filters['category_id.name']);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const report = [];
        if (results.length > 0) {
            for (let i = 0; i < results[0].rows.length; i++) {
                report.push(results[0].rows.item(i));
            }
        }
        return report;
    } catch (err) {
        throw new Error(`Error retrieving reportDocumentLine: ${err.message}`);
    }
};

export const getTotalReportDocumentLine = async (
    db: SQLiteDatabase,
    filters?: {
        location?: string;
        state?: string | string[];
        use_state?: string;
        default_code?: string;
        name?: string;
        'category_id.name'?: string;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM reportDocumentLine`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`reportDocumentLine.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.state !== undefined) {
        if (Array.isArray(filters.state)) {
            const statePlaceholders = filters.state.map(() => '?').join(', ');
            whereConditions.push(
                `reportDocumentLine.state IN (${statePlaceholders})`
            );
            queryParams.push(...filters.state);
        } else {
            whereConditions.push(`reportDocumentLine.state = ?`);
            queryParams.push(filters.state);
        }
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`reportDocumentLine.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`reportDocumentLine.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (filters?.name !== undefined) {
        whereConditions.push(`reportDocumentLine.code = ?`);
        queryParams.push(filters.name);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`reportDocumentLine.category = ?`);
        queryParams.push(filters['category_id.name']);
    }

    if (whereConditions.length > 0) {
        queryTotal += ` WHERE ` + whereConditions.join(' AND ');
    }

    try {
        const results = await db.executeSql(queryTotal, queryParams);
        if (results.length > 0) {
            return results[0].rows?.item(0)?.total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total report: ${err.message}`);
    }
};

export const updateReportDocumentLine = (
    db: SQLiteDatabase,
    documentAssetData: DocumentAssetData
) => {
    const setClauses = [];
    const queryParams = [];
    const whereConditions = [];

    if (documentAssetData.use_state !== undefined) {
        setClauses.push(`use_state = ?`);
        queryParams.push(documentAssetData.use_state);
    }

    if (documentAssetData.code !== undefined) {
        whereConditions.push(`code = ?`);
        queryParams.push(documentAssetData.code);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const queryUpdate = `UPDATE reportDocumentLine SET ${setClauses.join(
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
                        `Failed to create reportDocumentLine table: ${error.message}`
                    );
                }
            );
        });
        console.log('Report document line updated successfully');
    } catch (err) {
        throw new Error(`Error updating report document line : ${err.message}`);
    }
};

export const removeReportDocumentLineByCode = (
    db: SQLiteDatabase,
    code: string
) => {
    const deleteQuery = `DELETE FROM reportDocumentLine WHERE code = ?`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery, [code]);
        });
        console.log(`remove document line code: ${code} successfully`);
    } catch (err) {
        throw new Error(`Error remove document line: ${err.message}`);
    }
};
