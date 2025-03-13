import { GetBranchData } from '@src/typings/branch';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableBranch = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS branch(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            branch_id INTEGER NOT NULL UNIQUE,
            branch_code TEXT NOT NULL,
            branch_name TEXT,
            total_locations INTEGER,
            total_assets INTEGER
        );`;
            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table branch created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create branch table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableBranch error:', error);
        },
        () => {
            console.log('Transaction createTableBranch completed successfully');
        }
    );
};

export const insertBranchData = (
    db: SQLiteDatabase,
    branch: GetBranchData[]
) => {
    const queryInsert =
        `INSERT INTO branch (
         branch_id,
         branch_code,
         branch_name,
         total_locations,
         total_assets
    ) VALUES ` +
        branch
            .map(
                (item) =>
                    `(
                 ${item.branch_id},
                '${item.branch_code}',
                '${item.branch_name}',
                 ${item.total_locations},
                 ${item.total_assets}
                     )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All branch inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting branch: ${err.message}`);
    }
};

export const getBranch = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<GetBranchData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM branch`;

    const queryParams = [];

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const branch = [];

        if (results?.length > 0) {
            for (let i = 0; i < results[0]?.rows?.length; i++) {
                branch.push(results[0]?.rows?.item(i));
            }
        }
        return branch;
    } catch (err) {
        throw new Error(`Error retrieving branch: ${err.message}`);
    }
};

export const getBranchSuggestion = async (
    db: SQLiteDatabase,
    filters?: {
        branch_code?: string;
        branch_name?: string;
    },
    page: number = 1,
    limit: number = 10
): Promise<GetBranchData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM branch`;

    const queryParams = [];
    const whereConditions = [];

    if (filters?.branch_code !== undefined) {
        whereConditions.push(`branch.branch_code LIKE ?`);
        queryParams.push(`%${filters.branch_code}%`);
    }

    if (filters?.branch_name !== undefined) {
        whereConditions.push(`branch.branch_name LIKE ?`);
        queryParams.push(`%${filters.branch_name}%`);
    }

    if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' OR ');
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const results = await db.executeSql(query, queryParams);
        const branches = [];

        if (results.length > 0) {
            for (let i = 0; i < results[0].rows.length; i++) {
                branches.push(results[0].rows.item(i));
            }
        }

        return branches;
    } catch (err) {
        throw new Error(`Error retrieving branch: ${err.message}`);
    }
};
