import Backbone from 'backbone';

class Listener {}

_.extend(Listener.prototype, Backbone.Events);

export { Listener }