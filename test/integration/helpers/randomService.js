var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');

var Wsocket = require('@saio/wsocket-component');

var RandomService = function(container, options) {
  this.ws = container.use('ws', Wsocket, {
    url: 'ws://crossbar:8080',
    realm: 'saio',
    authId: 'service',
    password: 'service'
  });
};

RandomService.prototype.start = function() {
  return when.resolve();
};

RandomService.prototype.stop = function() {
  return when.resolve();
};

RandomService.prototype.getAll = function(license) {
  return this.ws.call('fr.saio.api.license.' + license + '.user.getAll');
};

RandomService.prototype.getUser = function(license, id) {
  return this.ws.call('fr.saio.api.license.' + license + '.user.get.' + id);
};

RandomService.prototype.createUser = function(license, user) {
  return this.ws.call('fr.saio.api.license.' + license + '.user.create', [], {user: user});
};

RandomService.prototype.updateUser = function(license, id, user) {
  return this.ws.call('fr.saio.api.license.' + license + '.user.update.' + id, [], {user: user});
};

RandomService.prototype.deleteUser = function(license, id) {
  return this.ws.call('fr.saio.api.license.' + license + '.user.delete.' + id);
};

module.exports = RandomService;
