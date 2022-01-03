module.exports = function runMigration(migration) {
  const dog = migration.createContentType('dog');
  dog.createField('name').name('name').type('Symbol').required(true);
};
