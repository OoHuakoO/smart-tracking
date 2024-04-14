import { DocumentAssetData } from '@src/typings/document';
import { ReportAssetData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableReportDocumentLine = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS reportDocumentLine (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            location_old TEXT,
            location TEXT,
            state TEXT,
            use_state TEXT
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
          code,
          name,
          category,
          location_old,
          location,
          state,
          use_state
    ) VALUES ` +
        documentAssetData
            .map(
                (item) => `(
                    '${item.code}',
                    '${item.name}',
                    '${item.category}',
                    '${item.location_old}',
                    '${item.location}',
                    '${item.state}',
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

export const getReport = async (
    db: SQLiteDatabase,
    filters?: {
        location?: string;
        state?: string;
    },
    isPagination: boolean = true,
    page: number = 1,
    limit: number = 10
): Promise<ReportAssetData[]> => {
    let query = `SELECT * FROM report`;

    const queryParams = [];
    const whereConditions = [];

    if (filters?.location !== undefined) {
        whereConditions.push(`report.location LIKE ?`);
        queryParams.push(`%${filters.location}%`);
    }

    if (filters?.state !== undefined) {
        whereConditions.push(`report.state LIKE ?`);
        queryParams.push(`%${filters.state}%`);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

    if (isPagination) {
        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

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
        throw new Error(`Error retrieving report: ${err.message}`);
    }
};

export const getTotalReport = async (db: SQLiteDatabase): Promise<number> => {
    const queryTotal = `SELECT COUNT(*) as total FROM report`;
    try {
        const results = await db.executeSql(queryTotal);
        if (results.length > 0) {
            return results[0].rows?.item(0)?.total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total report: ${err.message}`);
    }
};
