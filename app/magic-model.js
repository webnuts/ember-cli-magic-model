import DS from 'ember-data';

var MagicModel = DS.Model.extend();

MagicModel.reopenClass({
  parentResourceName: 'admin',
  indexRoutePath: undefined,
  newRoutePath: undefined,
  canCreateNew: true,

  toString: function() {
    return 'MagicModel';
  }
});

export default MagicModel;