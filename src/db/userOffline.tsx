import { UserList } from '@src/typings/login';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableUserOffline = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS userOffline(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            user_name TEXT,
            email TEXT,
            user_offline_mode BOOLEAN
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table userOffline created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create userOffline table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableUserOffline error:', error);
        },
        () => {
            console.log(
                'Transaction createTableUserOffline completed successfully'
            );
        }
    );
};

export const insertUserOffline = (db: SQLiteDatabase, userList: UserList[]) => {
    const queryInsert =
        `INSERT INTO userOffline (
            user_id,
            user_name,
            email,
            user_offline_mode
        ) VALUES ` +
        userList
            .map(
                (item) =>
                    `(
                  ${item.user_id},
                 '${item.user_name}',
                 '${item.email}',
                  ${item.user_offline_mode}
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All userOffline inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting userOffline: ${err.message}`);
    }
};

export const getUserOffline = async (
    db: SQLiteDatabase,
    filters?: {
        email?: string;
    }
): Promise<UserList[]> => {
    let query = `SELECT * FROM userOffline`;

    const queryParams = [];
    const whereConditions = [];

    if (filters?.email !== undefined) {
        whereConditions.push(`userOffline.email = ?`);
        queryParams.push(filters.email);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
    }

    try {
        const results = await db.executeSql(query, queryParams);
        const userOffline = [];

        if (results?.length > 0) {
            for (let i = 0; i < results[0]?.rows?.length; i++) {
                userOffline.push(results[0]?.rows?.item(i));
            }
        }
        return userOffline;
    } catch (err) {
        throw new Error(`Error retrieving userOffline: ${err.message}`);
    }
};
