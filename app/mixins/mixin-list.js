import Ember from "ember";
export default Ember.Mixin.create({
  itemActions: [
    {
      name: 'Edit',
      actionName: 'edit'
    },
    {
      name: 'Delete',
      actionName: 'delete'
    }
  ],

  sortProperty: undefined,
  sortOrder: undefined,
  columnSettings: undefined,

  columns: function() {
    var item = this.get('model.firstObject');
    var columns = [];
    if (item) {
      var columnWhiteList = this.get('columnWhiteList') || [];
      var columnSettings = this.get('columnSettings') || {};
      item.eachAttribute((columnName, binding) => {
        if (columnWhiteList.length && columnWhiteList.contains(columnName) === false) {
          return;
        }
        var label = columnName.camelcaseToString();
        if (binding.options && binding.options.label) {
          label = binding.options.label;
        }
        columns.pushObject({ label: label, key: columnName });
      });

      item.eachRelationship(function(columnName, binding) {
        var settingsForColumn = columnSettings[columnName];
        if (!settingsForColumn) {
          return;
        }
        var label = columnName.camelcaseToString();
        if (binding.options && binding.options.label) {
          label = binding.options.label;
        }

        var defaults = {
          label: label,
          key: columnName
        };

        var value = $.extend(true, defaults, settingsForColumn);

        columns.pushObject(value);
      });
    }
    return columns;
  }.property('model.firstObject', 'columnSettings'),

  listValues: function() {
    var columns = this.get('columns');

    var sortedModel = this.get('model');
    if (this.get('sortProperty')) {
      sortedModel = sortedModel.sortBy(this.get('sortProperty'));
    }
    if (this.get('sortOrder') === 'descending') {
      sortedModel = sortedModel.reverse();
    }


    return sortedModel.map((item) => {
      var objKeys = Ember.A();

      columns.forEach((column) => {
        objKeys.pushObject(this.getObjectFromKey(item, column.name, column.key, true));
      });

      if (objKeys.filterBy('key', 'id').get('length') === 0) {
        objKeys.pushObject(this.getObjectFromKey(item, 'id', 'id', false));
      }

      return { values: objKeys, item: item };
    });
  }.property('model.@each', 'columns.@each', 'sortProperty', 'sortOrder'),

  getObjectFromKey: function(item, columnName, columnKey, includeInList) {
    return Ember.Object.create({
      key: columnKey,
      label: columnName,
      source: item,
      value: Ember.computed.oneWay('source.' + columnKey).readOnly(),
      includeInList: includeInList
    });
  }
});