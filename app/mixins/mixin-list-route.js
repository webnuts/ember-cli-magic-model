import Ember from "ember";
import MixinList from './mixin-list';

export default Ember.Mixin.create({
  defaultTemplateName: 'mixin-list-view',

  init: function() {
    this._super();

    var fullName = 'controller:' + this.routeName;
    var currentController = this.container.lookup(fullName);
    if (!currentController) {
      var f = this.container.lookupFactory('controller:basic').extend({
        isGenerated: true,
        queryParams: Ember.keys(this.get('queryParams')),
        toString: function() {
          return "(generated " + this.routeName + " controller)";
        }
      });

      f.reopen(MixinList);

      this.container._registry.register(fullName, f);
    }
  },

  queryParams: {
    sortProperty: {
      refreshModel: true
    },
    sortOrder: {
      refreshModel: true
    }
  },

  setupController: function(controller, model) {
    controller.set('columnWhiteList', this.get('columnWhiteList'));
    controller.set('columnSettings', this.get('columns'));
    controller.set('canCreateNew', this.get('canCreateNew'));
    controller.set('model', model);
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

  actions: {
    createNew: function() {
      var newRoute = this.routeName.substring(0, this.routeName.lastIndexOf('.')) + ".new";
      this.transitionTo(newRoute);
    },

    itemAction: function(actionName, item) {
      if (actionName === 'edit') {
        var editRoute = this.routeName.substring(0, this.routeName.lastIndexOf('.')) + ".edit";
        this.transitionTo(editRoute, item.get('id'));
      }
      else if (actionName === 'delete') {
        if (confirm('Er du sikker?')) {
          item.destroyRecord();
        }
      }
    },

    sortAction: function(columnName) {
      var currentSortProperty = this.controller.get('sortProperty');
      var currentSortOrder = this.controller.get('sortOrder') || '';
      var sortOrder = '';

      if (currentSortProperty === columnName) {
        if (currentSortOrder !== 'descending') {
          sortOrder = 'descending';
        }
      }
      if (currentSortOrder !== sortOrder) {
        this.controller.set('sortOrder', sortOrder);
      }
      this.controller.set('sortProperty', columnName);
    }
  }
});