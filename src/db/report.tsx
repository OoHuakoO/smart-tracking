import { ReportAssetData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableReport = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS report (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            serial_no TEXT,
            location_old TEXT,
            location TEXT,
            quantity INTEGER NOT NULL,
            state TEXT,
            use_state TEXT,
            new_img BOOLEAN,
            image TEXT
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
                        `Failed to create report table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableReport error:', error);
        },
        () => {
            console.log('Transaction createTableReport completed successfully');
        }
    );
};

export const insertReportData = (
    db: SQLiteDatabase,
    reportAsset: ReportAssetData[]
) => {
    const queryInsert =
        `INSERT INTO report (
          code,
          name,
          category,
          serial_no,
          location_old,
          location,
          quantity,
          state,
          use_state,
          new_img,
          image
    ) VALUES ` +
        reportAsset
            .map(
                (item) => `(
                    '${item.code}',
                    '${item.name}',
                    '${item.category}',
                    '${item.serial_no}',
                    '${item.location_old}',
                    '${item.location}',
                     ${item.quantity},
                    '${item.state}',
                    '${item.use_state}',
                     ${item.new_img},
                    '${item.image}'
                    )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All report inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting report: ${err.message}`);
    }
};

export const getReport = async (
    db: SQLiteDatabase
): Promise<ReportAssetData[]> => {
    const query = `SELECT * FROM report`;
    try {
        const results = await db.executeSql(query);
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
