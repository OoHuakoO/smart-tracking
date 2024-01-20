module.exports = {
    $schema: 'https://json.schemastore.org/eslintrc',
    root: true,
    extends: ['@react-native', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ]
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser'
        }
    ]
};
