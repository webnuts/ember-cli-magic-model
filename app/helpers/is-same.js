import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper((value1, value2) => {
  if (Ember.isEmpty(value1) && Ember.isEmpty(value2)) {
    return true;
  }
  return value1 === value2;
});