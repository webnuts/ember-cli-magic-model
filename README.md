# ember-cli-magic-model

Plugin for ember-cli which autogenerates a lot of shared stuff between applications.

## Installation

To install simply run:

```
npm install git+ssh://git@github.com:webnuts/ember-cli-magic-model.git --save-dev
```

## Configuration

You need to modify the models you want to make editable in the admin section:

```
import DS from 'ember-data';
import MagicModel from '../magic-model';

var cmsPage = MagicModel.extend({
  title: DS.attr('string', { label: 'Titel' }),
  text: DS.attr('string', { label: 'Indhold', fieldType: 'richtext' })
  parent: DS.belongsTo('cmsPage', { inverse: 'children', async: true, label: 'Ovenliggende side' }),
});

cmsPage.reopenClass({
  overviewWhitelist: ['title'],
  indexRoutePath: 'sider',
  newRoutePath: 'ny',

  columns: {
    parent: {
      dataSource: function(store) {
        return store.find('cmsPage');
      },
      optionLabelPath: 'content.title'
    }
  }
});

export default cmsPage;
```

You can set additional attributes for model properties:

### label

The label is used as the label next to the field in the admin section. The default value is the property name with the first letter capitalized. Also, camelcase names are seperated by spaces.

### fieldType

You can specify a fieldtype for the property.

#### richtext

Displays a richtext input, which enables the user to write rich content.

#### dropdown

Displays a dropdown list.

#### checkbox-list

Displays a list of checkboxes.

#### number

Displays a numeric input field.

#### date

Displays a datepicker.

#### list-view

Displays a list of values specificed in the configuration.

#### item-view

Displays a specific item specificed in the configuration.

#### password

Displays a password field.

#### Everything else (also fields without fieldType specified)

Displays a text-field.

You can add configuration to your model by reopening your model:

```
cmsPage.reopenClass({
  overviewWhitelist: ['title'],
  indexRoutePath: 'sider',
  newRoutePath: 'ny',

  columns: {
    parent: {
      dataSource: function(store) {
        return store.find('cmsPage');
      },
      optionLabelPath: 'content.title'
    }
  }
});
```

#### overviewWhitelist

A collection of properties to display in the index view. If not specified all (not belongsTo and hasMany relationships) are shown.

#### indexRoutePath

The name of the index path in the URL.
Example: /admin/sider

Default is the name of the model.

#### newRoutePath

The name of the new path in the URL.
Example: /admin/sider/ny

Default is 'new'.

#### columns

You can specify configuration for each of the attributes. For example where to fetch data the data for hasMany / belongsTo relationships.
Also which field to display in dropdowns / checkboxes.