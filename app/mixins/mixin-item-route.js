import Ember from "ember";
import MixinItem from './mixin-item';

export default Ember.Mixin.create({
  defaultTemplateName: 'mixin-item',

  setupController: function(controller, model) {
    if (controller.isGenerated) {
      controller.reopen(MixinItem);
    }
    var modelName = this.get('modelName');
    if (!modelName && model.constructor.typeKey) {
      modelName = model.constructor.typeKey;
    }

    var columns = this.get('columns');
    controller.set('model', model);
    controller.set('model.modelName', modelName);
    controller.set('model.columnSettings', columns);
    controller.set('model.columnExcludeList', this.get('columnExcludeList'));

    var self = this;
    if (columns) {
      var indexer = 0;
      Ember.keys(columns).forEach(function(columnKey) {
        var column = columns[columnKey];
        indexer++;
        if (typeof column.dataSource === 'function') {
          var controllerDataName = 'model.value' + indexer;
          controller.set(controllerDataName, column.dataSource(self.store));
          column.optionValues = 'content.' + controllerDataName;
        }
      });
    }
  },

  renderTemplate: function() {
    var currentController = this.container.lookup('controller:' + this.routeName);

    if (currentController.isGenerated) {
      this.render(this.get('defaultTemplateName'));
    }
    else {
      this.render();
    }
  },

  validateForm: function() {
    return $("#update-item-form").valid();
  },
  
  actions: {
    itemAction: function(actionName) {
      var self = this;
      var indexRoute = this.routeName.substring(0, this.routeName.lastIndexOf('.')) + ".index";
      if (actionName === 'back') {
        this.transitionTo(indexRoute);
      }
      else if (actionName === 'save') {
        if (this.validateForm()) {
          var model = self.controller.get('model');

          if (Ember.typeOf(model) === 'instance') {
            model.save().then(function() {
              self.transitionTo(indexRoute);
            });
          }
          else {
            var modelName = this.get('modelName');
            var record = this.store.createRecord(modelName, model);
            record.save().then(function() {
              self.transitionTo(indexRoute);
            });
          }
        }
      }
    }
  }
});