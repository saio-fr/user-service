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
      { match: 'wildcard', invoke: 'roundrobin'}),
    this.ws.register('fr.saio.internal.user.login',
      this.login.bind(this),
      { match: 'wildcard', invoke: 'roundrobin'}),
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
    console.error(err);
    throw err;
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
    console.log(err);
    throw err;
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
    avatar: kwargs.user.avatar,
    roles: kwargs.user.roles
  }).then((user) => {

    var roles = kwargs.user.roles.map((role) => {
      return {
        name: role,
        params: {
          authId: user.id,
          license: user.license
        }
      };
    });

    return this.ws.call('fr.saio.service.authorizer.roles.set', [], {
      authId: user.id,
      roles: roles
    }).then((res) => {
      return user;
    }).catch((err) => {
      throw err;
    });

  }).catch((err) => {
    console.log(err);
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
      user.roles = kwargs.user.roles;

      // Don't reset password if no one is provided
      if (kwargs.user.password) {
        user.password = kwargs.user.password;
      }

      return user.save().then((user) => {

        var roles = kwargs.user.roles.map((role) => {
          return {
            name: role,
            params: {
              authId: user.id,
              license: user.license
            }
          };
        });

        return this.ws.call('fr.saio.service.authorizer.roles.set', [], {
          authId: user.id,
          roles: roles
        }).then((res) => {
          return user;
        }).catch((err) => {
          throw err;
        });

      }).catch((err) => {
        console.log(err);
        throw err;
      });
    } else {
      throw new Error('User not found. Check the id provided.');
    }
  }).catch((err) => {
    console.error(err);
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
    if (user) {
      return user.destroy().then(() => {

        // delete the user in roles table
        return this.ws.call('fr.saio.service.authorizer.roles.remove', [], {
          authId: user.id
        }).catch((err) => {
          throw err;
        });

      }).catch((err) => {
        throw err;
      });

    } else {
      throw new Error('User not found. Check the id provided.');
    }
  }).catch((err) => {
    console.error(err);
    throw err;
  });
};

/**
 * kwargs.email: string
 * kwargs.password: string
 */
UserService.prototype.login = function(args, kwargs, details) {

  if (!(kwargs.email || kwargs.email instanceof String)) {
    throw new Error('invalid email');
  }

  if (!(kwargs.password || kwargs.password instanceof String)) {
    throw new Error('invalid password');
  }

  var hash = crypto.createHash('sha1')
    .update(kwargs.password)
    .digest('hex');

  return this.db.model.User.findOne({
    where: {
      email: kwargs.email,
      hash: hash
    }
  }).catch((err) => {
    console.error(err);
    throw new Error('Internal server error');
  });
};

/**
 * details.wildcards[0]: id
 */
UserService.prototype.onGroupDeletion = function(args, kwargs, details) {
};

module.exports = UserService;
