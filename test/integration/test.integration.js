var tape = require('blue-tape');
var when = require('when');
var _ = require('underscore');
var Db = require('@saio/db-component');
var Tester = require('@saio/service-runner').Tester;
var RandomService = require('./helpers/randomService.js');

var license1 = '630fd82f-8abd-475d-a845-3a1f7632660c';
var license2 = '2db862c2-825c-4c2b-9cf4-26e16519e5f6';

tape('create an invalid user with empty names', function(t) {

  var user = {
    firstname: '',
    lastname: '',
    email: 'johndoe@gmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com',
    roles: ['chat']
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createUser(license1, user).then(function(res) {
      t.fail('user has been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create an invalid user with a wrong email', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoegmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com',
    roles: ['chat']
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createUser(license1, user).then(function(res) {
      t.fail('user has been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create an invalid user with a short password', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: 'john',
    avatar: 'http://myavatar.com',
    roles: ['chat']
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createUser(license1, user).then(function(res) {
      t.fail('user has been created');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});

tape('create a valid user', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com'

    // roles: ['chat']
    // To test when authorizer accept array
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createUser(license1, user).then(function(res) {

      if (!res.hash || user.password == res.hash) {
        t.fail('user has been created but password is not hashed');
      }
      if (res.license !== license1) {
        t.fail('user has been created but the license is not correct');
      }
      t.pass('user has been correctly created');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

// We will set that when a valid user has been created
// to get a specific user later.
var userId = '';

tape('create another valid user', function(t) {

  var user = {
    firstname: 'albert',
    lastname: 'doe',
    email: 'albertdoe@gmail.com',
    password: 'albertalbert',
    avatar: 'http://myavatar.com'

    // roles: ['chat']
    // To test when authorizer accepts array
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.createUser(license2, user).then(function(res) {

      userId = res.id;

      if (!res.hash || user.password == res.hash) {
        t.fail('user has been created but password is not hashed');
      }
      if (res.license !== license2) {
        t.fail('user has been created but the license is not correct');
      }
      t.pass('user has been correctly created');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get all users by license', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getAll(license2).then(function(res) {

      if (res.length && res.length < 2) {
        t.pass('users can be retrieved by license');
      } else {
        t.fail('users can\'t be retrieved by license');
      }

      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('get a specific user', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.getUser(license2, userId).then(function(res) {

      if (res) {
        t.pass('user can be retrieved by license & id');
      } else {
        t.fail('user can\'t be retrieved');
      }

      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});
