export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    /**
     * Skipping non-testable files.
     * @see https://jestjs.io/docs/en/webpack#handling-static-assets
     */
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    verbose: true,
};