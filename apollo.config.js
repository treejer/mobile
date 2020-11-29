module.exports = {
  client: {
    service: {
      name: 'treejer_api',
      localSchemaFile: './src/data/schema/treejer_api.graphql',
      includes: './src/**/*.graphql',
    },
    excludes: 'src/data/schema/**/*',
    clientOnlyDirectives: ['connection', 'type', 'rest'],
    clientSchemaDirectives: ['client', 'rest', 'contract'],
  },
};
