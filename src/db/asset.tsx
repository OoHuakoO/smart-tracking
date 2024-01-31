import { AssetData } from '@src/typings/asset';
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
            serial_no TEXT,
            brand_name TEXT,
            quantity INTEGER NOT NULL,
            location_id INTEGER,
            picture TEXT
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
      serial_no,
      brand_name,
      quantity,
      location_id,
      picture
    ) VALUES ` +
        assets
            .map(
                (item) => `(
                    ${item.asset_id},
                    '${item.default_code}',
                    '${item.name}',
                    '${item.description}',
                    ${item.category_id},
                    '${item.serial_no}',
                    '${item.brand_name}',
                    ${item.quantity},
                    ${item.location_id},
                    '${item.picture}'
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
