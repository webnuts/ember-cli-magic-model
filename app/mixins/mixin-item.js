import Ember from "ember";
export default Ember.Mixin.create({
  getBindingOption: function(binding, option) {
    if (binding && binding.options && binding.options[option]) {
      return binding.options[option];
    }
  },

  columns: function() {
    var self = this;
    var modelName = this.get('model.modelName');
    var columnSettings = this.get('model.columnSettings') || {};
    var columnExcludeList = this.get('model.columnExcludeList') || [];
    var columns = [];

    if (modelName) {
      var model = this.store.modelFor(modelName);
      model.eachAttribute((columnName, binding) => {
        if (columnExcludeList.contains(columnName)) {
          return;
        }

        var label = self.getBindingOption(binding, 'label') || columnName.camelcaseToString();

        var defaults = {
          label: label,
          key: columnName,
          type: self.getBindingOption(binding, 'fieldType') || binding.type,
          prompt: 'Angiv ' + label.toLowerCase()
        };

        var value = defaults;

        var settingsForColumn = columnSettings[columnName];
        if (settingsForColumn) {
          value = $.extend(true, defaults, settingsForColumn);
        }

        columns.pushObject(value);
      });

      model.eachRelationship(function(columnName, binding) {
        var settingsForColumn = columnSettings[columnName];
        if (!settingsForColumn || columnExcludeList.contains(columnName)) {
          return;
        }

        var label = self.getBindingOption(binding, 'label') || columnName.camelcaseToString();

        var defaults = {
          label: label,
          key: columnName,
          type: binding.kind === 'belongsTo' ? 'dropdown' : 'checkbox-list',
          optionLabelPath: 'content.name',
          prompt: 'Angiv ' + label.toLowerCase()
        };

        if (typeof settingsForColumn.optionValues === 'string') {
          settingsForColumn.optionValues = Ember.computed.alias(settingsForColumn.optionValues);
        }

        var value = $.extend(true, defaults, settingsForColumn);

        columns.pushObject(value);
      });
    }
    return columns;
  }.property('model.columnSettings', 'model.columnExcludeList', 'model.modelName'),

  itemValues: function() {
    var columns = this.get('columns');
    var item = this.get('model');

    var objKeys = Ember.A();

    columns.forEach((column) => {
      objKeys.pushObject(this.getObjectFromKey(this, column.key, true, column));
    });

    if (objKeys.filterBy('key', 'id').get('length') === 0) {
      objKeys.pushObject(this.getObjectFromKey(this, 'id', false));
    }

    return { values: objKeys, item: item };
  }.property('model', 'columns.@each'),

  model: function() {
    return {};
  },

  getObjectFromKey: function(item, columnKey, includeInList, options) {
    var defaults = {
      key: columnKey,
      content: item,
      value: Ember.computed.alias('content.model.' + columnKey),
      includeInList: includeInList,
      classNames: "form-control"
    };

    if (options && options.required) {
      defaults.classNames += " required";
    }

    return Ember.Object.create($.extend(true, defaults, options));
  },

  itemActions: [
    {
      name: 'Gem ændringer',
      actionName: 'save'
    },
    {
      name: 'Tilbage til oversigt',
      actionName: 'back'
    }
  ]
});