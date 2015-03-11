import Ember from 'ember';

export default Ember.Component.extend({
  item: undefined,
  columns: undefined,

  itemColumns: function() {
    var item = this.get('item');
    var columnsToInclude = this.get('columns');

    var columns = Ember.A();
    columnsToInclude.forEach((columnToInclude) => {
      var o = Ember.Object.create({
        content: item,
        value: Ember.computed.alias('content.' + columnToInclude.path)
      });
      columns.pushObject(o);
    });

    return columns;
  }.property('item', 'columns')
});