module.exports = {
    presets: ['module:@react-native/babel-preset'],
    env: {
        production: {
            plugins: ['react-native-paper/babel']
        }
    },
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                cwd: 'babelrc',
                extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
                alias: {
                    '@src': './src'
                }
            }
        ],
        'jest-hoist'
    ]
};
