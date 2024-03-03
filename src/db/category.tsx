import { CategoryData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableCategory = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS category(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL UNIQUE,
            category_name TEXT NOT NULL,
            category_code TEXT NOT NULL
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table category created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create category table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableCategory error:', error);
        },
        () => {
            console.log(
                'Transaction createTableCategory completed successfully'
            );
        }
    );
};

export const insertCategoryData = (
    db: SQLiteDatabase,
    category: CategoryData[]
) => {
    const queryInsert =
        `INSERT INTO category (
            category_id,
            category_name,
            category_code
        ) VALUES ` +
        category
            .map(
                (item) =>
                    `(
                  ${item.category_id},
                 '${item.category_name}',
                 '${item.category_code}'
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All category inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting category: ${err.message}`);
    }
};

export const getCategory = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<CategoryData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM category`;

    const queryParams = [];

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const category = [];

        if (results?.length > 0) {
            for (let i = 0; i < results[0]?.rows?.length; i++) {
                category.push(results[0]?.rows?.item(i));
            }
        }
        return category;
    } catch (err) {
        throw new Error(`Error retrieving category: ${err.message}`);
    }
};
