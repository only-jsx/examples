export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    verbose: true,
};