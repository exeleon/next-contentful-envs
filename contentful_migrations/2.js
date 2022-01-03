module.exports = function runMigration(migration) {
  const dog = migration.createContentType('dog');
  dog.createField('name').type('Symbol').required(true);
};
