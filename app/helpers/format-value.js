import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper((value) => {
  if (value instanceof Date) {
    return moment(value).format('DD/MM/YYYY');
  }
  return value;
});