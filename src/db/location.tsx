import { LocationData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableLocation = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS location(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_id INTEGER NOT NULL UNIQUE,
            location_name TEXT NOT NULL,
            location_code TEXT NOT NULL
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table location created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create location table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableLocation error:', error);
        },
        () => {
            console.log(
                'Transaction createTableLocation completed successfully'
            );
        }
    );
};

export const insertLocationData = (
    db: SQLiteDatabase,
    locations: LocationData[]
) => {
    const queryInsert =
        `INSERT INTO location (
            location_id,
            location_name,
            location_code
        ) VALUES ` +
        locations
            .map(
                (item) =>
                    `(
                  ${item.location_id},
                 '${item.location_name}',
                 '${item.location_code}'
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All locations inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting locations: ${err.message}`);
    }
};

export const getLocations = async (
    db: SQLiteDatabase,
    filters?: {
        name?: string;
    },
    page: number = 1,
    limit: number = 10
): Promise<LocationData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM location`;

    const queryParams = [];
    const whereConditions = [];

    if (filters?.name !== undefined) {
        whereConditions.push(`location.name LIKE ?`);
        queryParams.push(`%${filters.name}%`);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const locations = [];

        if (results.length > 0) {
            for (let i = 0; i < results[0].rows.length; i++) {
                locations.push(results[0].rows.item(i));
            }
        }

        return locations;
    } catch (err) {
        throw new Error(`Error retrieving locations: ${err.message}`);
    }
};

export const getTotalLocations = async (
    db: SQLiteDatabase
): Promise<number> => {
    const queryTotal = `SELECT COUNT(*) as total FROM location`;

    try {
        const results = await db.executeSql(queryTotal);
        if (results.length > 0) {
            return results[0].rows?.item(0)?.total;
        } else {
            return 0;
        }
    } catch (err) {
        throw new Error(`Error calculating total locations: ${err.message}`);
    }
};
