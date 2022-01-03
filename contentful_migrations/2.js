module.exports = function runMigration(migration) {
  const dog = migration.createContentType('dog', {
    name: 'Dog',
    description: 'Test description for a Dog'
  });
  dog.createField('name').name('name').type('Symbol').required(false);
};
