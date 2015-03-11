import Ember from 'ember';
import Router from '../router';
import config from '../config/environment';
import MixinListRoute from '../mixins/mixin-list-route';
import MixinItemRoute from '../mixins/mixin-item-route';

export function initialize(container, application) {
  container = application.__container__;

  function generateRoute(routeName, initializeProperties, mixins) {
    var containerRouteName = "route:" + routeName;
    var currentRoute = container.lookup(containerRouteName);
    if (!currentRoute) {
      var generatedRoute = container.lookupFactory('route:basic').extend(initializeProperties);
      mixins.forEach(function(mixin) {
        generatedRoute.reopen(mixin);
      });
      container._registry.register(containerRouteName, generatedRoute);
    }
  }

  function buildIndexRoute(singularResourceName, module) {
    var initializeProperties = {};
    var fullRouteName = (module.resourceName || singularResourceName.pluralize()) + ".index";
    initializeProperties.routeName = fullRouteName;
    initializeProperties.columnWhiteList = module.overviewWhitelist;
    
    initializeProperties.model = module.model || function() { return this.store.find(singularResourceName); };
    initializeProperties.columnExcludeList = module.columnExcludeList;
    initializeProperties.canCreateNew = module.canCreateNew;

    generateRoute(fullRouteName, initializeProperties, [MixinListRoute]);
  }

  function buildEditRoute(singularResourceName, module) {
    var initializeProperties = {};
    var fullRouteName = (module.resourceName || singularResourceName.pluralize()) + ".edit";

    initializeProperties.model = module.model || function(params) { return this.store.find(singularResourceName, params.id); };
    initializeProperties.columns = module.columns;
    initializeProperties.columnExcludeList = module.columnExcludeList;

    generateRoute(fullRouteName, initializeProperties, [MixinItemRoute]);
  }

  function buildNewRoute(singularResourceName, module) {
    var initializeProperties = {};

    var fullRouteName = (module.resourceName || singularResourceName.pluralize()) + ".new";

    initializeProperties.modelName = initializeProperties.modelName || singularResourceName;
    initializeProperties.columns = module.columns;
    initializeProperties.columnExcludeList = module.columnExcludeList;

    generateRoute(fullRouteName, initializeProperties, [MixinItemRoute]);
  }

  var resourcesToCreate = [];

  if (window.require) {
    Ember.keys(window.require._eak_seen).forEach(function(moduleName) {
      if (moduleName.indexOf(config.modulePrefix + '/models/') === 0) {
        var module = window.require(moduleName).default;
        if (module.toString() === 'MagicModel') {
          var moduleNameWithoutPath = moduleName.substring(moduleName.lastIndexOf('/') + 1);
          var resourceName = moduleNameWithoutPath.camelize();

          buildIndexRoute(resourceName, module);
          buildEditRoute(resourceName, module);
          if (module.canCreateNew) {
            buildNewRoute(resourceName, module);
          }

          var resourcesForParentResource = resourcesToCreate.findBy('parentResourceName', module.parentResourceName);
          if (!resourcesForParentResource) {
            resourcesForParentResource = {
              parentResourceName: module.parentResourceName,
              resources: []
            };
            resourcesToCreate.push(resourcesForParentResource);
          }
          resourcesForParentResource.resources.push({
            resourceName: module.resourceName || resourceName.pluralize(),
            indexRoutePath: module.indexRoutePath,
            newRoutePath: module.newRoutePath,
            canCreateNew: module.canCreateNew
          });
        }
      }
    });

    Router.map(function() {
      var routerSelf = this;
      resourcesToCreate.forEach(function(resourcesForParentResource) {
        routerSelf.resource(resourcesForParentResource.parentResourceName, function() {
          var resourceSelf = this;
          resourcesForParentResource.resources.forEach(function(resource) {
            resourceSelf.resource(resource.resourceName, { path: resource.indexRoutePath }, function() {
              this.route('edit', { path: ':id' });
              if (resource.canCreateNew) {
                this.route('new', { path: resource.newRoutePath });
              }
            });
          });
        });
      });
    });
  }
}

export default {
  name: 'inject-admin-routes',
  initialize: initialize
};