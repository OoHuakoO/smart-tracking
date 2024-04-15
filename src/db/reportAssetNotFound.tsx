import { AssetData, ReportAssetData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableReportAssetNotFound = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS reportAssetNotFound (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            location TEXT,
            use_state TEXT
        );`;

            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table report created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create reportAssetNotFound table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log(
                'Transaction createTableReportAssetNotFound error:',
                error
            );
        },
        () => {
            console.log(
                'Transaction createTableReportAssetNotFound completed successfully'
            );
        }
    );
};

export const insertReportAssetNotFound = (
    db: SQLiteDatabase,
    documentAssetData: AssetData[]
) => {
    const queryInsert =
        `INSERT INTO reportAssetNotFound (
        code,
        name,
        category,
        location,
        use_state
  ) VALUES ` +
        documentAssetData
            .map(
                (item) => `(
                  '${item.default_code}',
                  '${item.name}',
                  '${item.category}',
                  '${item.location}',
                  '${item.use_state}'
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
                    'Transaction insertReportAssetNotFound error:',
                    error
                );
            },
            () => {
                console.log(
                    'Transaction insertReportAssetNotFound completed successfully'
                );
            }
        );
        console.log('All reportAssetNotFound inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting report: ${err.message}`);
    }
};

export const getReportAssetNotFound = async (
    db: SQLiteDatabase,
    filters?: {
        location?: string;
        use_state?: string;
        default_code?: string;
        name?: string;
        'category_id.name'?: string;
    },
    page: number = 1,
    limit: number = 10
): Promise<ReportAssetData[]> => {
    let query = `SELECT * FROM reportAssetNotFound`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`reportAssetNotFound.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`reportAssetNotFound.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`reportAssetNotFound.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (filters?.name !== undefined) {
        whereConditions.push(`reportAssetNotFound.code = ?`);
        queryParams.push(filters.name);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`reportAssetNotFound.category = ?`);
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
        throw new Error(`Error retrieving reportAssetNotFound: ${err.message}`);
    }
};

export const getTotalReportAssetNotFound = async (
    db: SQLiteDatabase,
    filters?: {
        location?: string;
        use_state?: string;
        default_code?: string;
        name?: string;
        'category_id.name'?: string;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM reportAssetNotFound`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`reportAssetNotFound.location = ?`);
        queryParams.push(filters.location);
    }

    if (filters?.use_state !== undefined) {
        whereConditions.push(`reportAssetNotFound.use_state = ?`);
        queryParams.push(filters.use_state);
    }

    if (filters?.default_code !== undefined) {
        whereConditions.push(`reportAssetNotFound.code = ?`);
        queryParams.push(filters.default_code);
    }

    if (filters?.name !== undefined) {
        whereConditions.push(`reportAssetNotFound.code = ?`);
        queryParams.push(filters.name);
    }

    if (filters && filters['category_id.name'] !== undefined) {
        whereConditions.push(`reportAssetNotFound.category = ?`);
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
        throw new Error(
            `Error calculating total reportAssetNotFound: ${err.message}`
        );
    }
};

export const removeReportAssetNotFoundByCode = (
    db: SQLiteDatabase,
    code: string
) => {
    const deleteQuery = `DELETE FROM reportAssetNotFound WHERE code = ?`;
    try {
        db.transaction((tx) => {
            tx.executeSql(deleteQuery, [code]);
        });
        console.log(
            `remove report asset not found  code: ${code} successfully`
        );
    } catch (err) {
        throw new Error(`Error remove report asset not found: ${err.message}`);
    }
};
