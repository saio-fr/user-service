var _ = require('underscore');
var moment = require('moment');
var crypto = require('crypto');
var Wsocket = require('@saio/wsocket-component');
var Db = require('@saio/db-component');
var Config = require('./config.js');

var UserService = function(container, options) {
  var config = Config.build(options);
  this.ws = container.use('ws', Wsocket, config.ws);
  this.db = container.use('db', Db, config.db);
  this.authorizedRoles = ['chat', 'knowledge', 'admin'];
};

UserService.prototype.start = function() {
  var promises = [
    this.ws.register('fr.saio.api.license..user.getAll',
      this.getAll.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..user.get.',
      this.get.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..user.create',
      this.create.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..user.update.',
      this.update.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.api.license..user.delete.',
      this.delete.bind(this),
    this.ws.register('fr.saio.api.internal.user.login',
      this.login.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'})),
    this.ws.subscribe('fr.saio.internal.group',
      this.onGroupDeletion.bind(this))
  ];

  Promise.all(promises).then(function() {
    console.log('user-service started');
    return Promise.resolve();
  });
};

UserService.prototype.stop = function() {
  return this.ws.unregister()
  .then(function() {
    console.log('user-service stopped');
    return Promise.resolve();
  });
};

/**
 * details.wildcards[0]: license
 */
UserService.prototype.getAll = function(args, kwargs, details) {
  return this.db.model.User.findAll({
    where: {
      license: details.wildcards[0]
    }
  }).catch((err) => {
    console.error(err.stack);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 */
UserService.prototype.get = function(args, kwargs, details) {

  return this.db.model.User.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).catch((err) => {
    console.log(err.message);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: license
 * kwargs.user: object
 */
UserService.prototype.create = function(args, kwargs, details) {

  return this.db.model.User.create({
    license: details.wildcards[0],
    email: kwargs.user.email,
    password: kwargs.user.password,
    firstname: kwargs.user.firstname,
    lastname: kwargs.user.lastname,
    avatar: kwargs.user.avatar
  }).then((user) => {

    // var unauthorizedRole = kwargs.user.roles.map((role) => {
      // if (!this.authorizedRoles.contains(role)) {
        // return role;
      // }
    // });
    //
    //Check if user.roles don't contains any invalid roles.
    // if (!_.isEmpty(unauthorizedRole)) {
      // this.ws.call('fr.saio.api.authorizer.roles.set', [], {
        // authId: user.id,
        // roles: kwargs.user.roles
      // }).catch((err) => {
        //Delete the user cause he does not have a valid role
        // user.destroy();
        // throw err;
      // });
    // } else {
      // throw new Error('you have specified an invalid role');
    // }

    return user;

  }).catch((err) => {
    console.log(err.message);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 * kwargs.user: object
 */
UserService.prototype.update = function(args, kwargs, details) {

  return this.db.model.User.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).then((user) => {
    if (user) {

      user.email = kwargs.user.email;
      user.firstname = kwargs.user.firstname;
      user.lastname = kwargs.user.lastname;
      user.avatar = kwargs.user.avatar;

      // Don't reset password if no one is provided
      if (kwargs.user.password) {
        user.password = kwargs.user.password;
      }

      return user.save().then((user) => {

      //   var unauthorizedRole = kwargs.user.roles.map((role) => {
      //     if (!this.authorizedRoles.contains(role)) {
      //       return role;
      //     }
      //   });
      //
      //   // Check if user.roles don't contains any invalid roles.
      //   if (!_.isEmpty(unauthorizedRole)) {
      //     this.ws.call('fr.saio.api.authorizer.roles.set', [], {
      //       authId: user.id,
      //       roles: kwargs.user.roles
      //     }).catch((err) => {
      //       throw err;
      //     });
      //   } else {
      //     throw new Error('you have specified an invalid role');
      //   }
      }).catch((err) => {
        console.log(err.stack);
        throw err;
      });
    } else {
      throw new Error('User not found. Check the id provided.');
    }
  }).catch((err) => {
    console.error(err.stack);
    throw err;
  });
};

/**
 * details.wildcards[0]: license
 * details.wildcards[1]: id
 */
UserService.prototype.delete = function(args, kwargs, details) {

  return this.db.model.User.findOne({
    where: {
      license: details.wildcards[0],
      id: details.wildcards[1]
    }
  }).then((user) => {
    return user.destroy();
  }).catch((err) => {
    console.error(err.stack);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: email
 * details.wildcards[1]: password
 */
UserService.prototype.login = function(args, kwargs, details) {

  var hash = crypto.createHash('sha1')
    .update(details.wildcards[1])
    .digest('hex');

  return this.db.model.User.findOne({
    where: {
      email: details.wildcards[0],
      hash: hash
    }
  }).catch((err) => {
    console.error(err.stack);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: id
 */
UserService.prototype.onGroupDeletion = function(args, kwargs, details) {
};

module.exports = UserService;
