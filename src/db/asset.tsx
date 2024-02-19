import { AssetData } from '@src/typings/downloadDB';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createTableAsset = (db: SQLiteDatabase) => {
    db.transaction(
        (tx) => {
            const query = `CREATE TABLE IF NOT EXISTS asset(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id INTEGER NOT NULL,
            default_code TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            category_id INTEGER,
            category TEXT,
            serial_no TEXT,
            brand_name TEXT,
            quantity INTEGER NOT NULL,
            location_id INTEGER,
            location TEXT,
            image TEXT,
            use_state TEXT,
            new_img BOOLEAN,
            owner TEXT
        );`;

            tx.executeSql(
                query,
                [],
                () => {
                    console.log('Table asset created successfully');
                },
                (_, error) => {
                    console.log(
                        'Error occurred while creating the table:',
                        error
                    );
                    throw new Error(
                        `Failed to create asset table: ${error.message}`
                    );
                }
            );
        },
        (error) => {
            console.log('Transaction createTableAsset error:', error);
        },
        () => {
            console.log('Transaction createTableAsset completed successfully');
        }
    );
};

export const insertAssetData = (db: SQLiteDatabase, assets: AssetData[]) => {
    const queryInsert =
        `INSERT INTO asset (
      asset_id,
      default_code,
      name,
      description,
      category_id,
      category,
      serial_no,
      brand_name,
      quantity,
      location_id,
      location,
      image,
      use_state,
      new_img,
      owner
    ) VALUES ` +
        assets
            .map(
                (item) => `(
                    ${item.asset_id},
                    '${item.default_code}',
                    '${item.name}',
                    '${item.description}',
                    ${item.category_id},
                    '${item.category}',
                    '${item.serial_no}',
                    '${item.brand_name}',
                    ${item.quantity},
                    ${item.location_id},
                    '${item.location}',
                    '${item.image}',
                    '${item.use_state}',
                    ${item.new_img},
                    '${item.owner}'
                    )`
            )
            .join(',');

    try {
        db.transaction((tx) => {
            tx.executeSql(queryInsert);
        });
        console.log('All assets inserted successfully');
    } catch (err) {
        throw new Error(`Error inserting assets: ${err.message}`);
    }
};

export const getAsset = async (
    db: SQLiteDatabase,
    filters?: {
        location_id?: number;
    },
    page: number = 1,
    limit: number = 10
): Promise<AssetData[]> => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM asset`;

    const queryParams = [];
    const whereConditions = [];

    if (filters?.location_id !== undefined) {
        whereConditions.push(`asset.location_id = ?`);
        queryParams.push(filters.location_id);
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
        throw new Error(`Error retrieving assets: ${err.message}`);
    }
};

export const getTotalAssets = async (
    db: SQLiteDatabase,
    filters?: {
        location_id?: number;
    }
): Promise<number> => {
    let queryTotal = `SELECT COUNT(*) as total FROM asset`;
    const queryParams = [];
    const whereConditions = [];

    if (filters?.location_id !== undefined) {
        whereConditions.push(`location_id = ?`);
        queryParams.push(filters.location_id);
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
        throw new Error(`Error calculating total assets :  ${err.message}`);
    }
};
