import Ember from 'ember';

export default Ember.Component.extend({
  collection: undefined,
  columns: undefined,

  listItems: function() {
    var collection = this.get('collection');
    var rows = Ember.A();

    if (collection) {
      var columnsToInclude = this.get('columns');

      collection.forEach(function(item) {
        var columns = Ember.A();
        columnsToInclude.forEach((columnToInclude) => {
          var o = Ember.Object.create({
            content: item,
            value: Ember.computed.alias('content.' + columnToInclude.path)
          });
          columns.pushObject(o);
        });
        rows.pushObject(columns);
      });
    }

    return rows;
  }.property('collection.@each', 'columns')
});