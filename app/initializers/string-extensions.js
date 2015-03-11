export function initialize() {
  String.prototype.camelcaseToString = function() {
    var words = this.match(/[A-Za-z][a-z]*/g);
    return words.join(" ").toLowerCase().capitalize();
  };
}

export default {
  name: 'string-extensions',
  initialize: initialize
};