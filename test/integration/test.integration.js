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
    roles: ['ChatOperator']
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
    roles: ['ChatOperator']
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
    roles: ['ChatOperator']
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

tape('create an invalid user with an invalid role', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com',
    roles: ['ChatOperator', 'SuperAdmin']
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

tape('create an invalid user without roles', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com'
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

tape('create an invalid user with empty roles', function(t) {

  var user = {
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    password: 'johnjohn',
    avatar: 'http://myavatar.com',
    roles: []
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
    avatar: 'http://myavatar.com',
    roles: ['ChatOperator', 'KnowledgeOperator']
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
    avatar: 'http://myavatar.com',
    roles: ['ChatOperator', 'KnowledgeOperator']
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

// tape('create a valid user with an already taken email', function(t) {
//
// var user = {
// firstname: 'arthur',
// lastname: 'doe',
// email: 'albertdoe@gmail.com',
// password: 'arthur8',
// avatar: 'http://myavatar.com',
// roles: ['ChatOperator', 'KnowledgeOperator']
// };
//
// var Test = function(container) {
// this.randomService = container.use('randomService', RandomService, {});
// };
//
// var tester = new Tester(Test);
// var client = tester.service.randomService;
// return tester.start()
// .then(function() {
// return client.createUser(license2, user).then(function(res) {
// t.fail('user has been created');
// return tester.stop();
// }).catch(function(err) {
// t.pass(err.message);
// return tester.stop();
// });
// });
// });

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

tape('update an user', function(t) {

  var user = {
    firstname: 'johny',
    lastname: 'doel',
    email: 'albertdoe2@gmail.com',
    password: 'johnjohny2',
    avatar: 'http://myavatar.com',
    roles: ['ChatOperator', 'KnowledgeOperator', 'Admin']
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.updateUser(license2, userId, user).then(function(res) {

      if (res.firstname === 'johny' && res.lastname === 'doel') {
        t.pass('user has been correctly updated');
      } else {
        t.fail('user has not been correctly updated');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('login with a valid email/password', function(t) {

  var user = {
    email: 'albertdoe2@gmail.com',
    password: 'johnjohny2'
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.loginUser(user.email, user.password).then(function(res) {

      if (res) {
        t.pass('user did log');
      } else {
        t.fail('user login failed');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('login with an invalid email/password', function(t) {

  var user = {
    email: 'albertdoe2@gmail.com',
    password: 'johnjohnyy'
  };

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.loginUser(user.email, user.password).then(function(res) {

      if (res) {
        t.fail('user did log');
      } else {
        t.pass('user login failed');
      }
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('delete an user', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.deleteUser(license2, userId).then(function(res) {
      t.pass('user has been correctly deleted');
      return tester.stop();
    }).catch(function(err) {
      t.fail(err.message);
      return tester.stop();
    });
  });
});

tape('delete an invalid user', function(t) {

  var Test = function(container) {
    this.randomService = container.use('randomService', RandomService, {});
  };

  var tester = new Tester(Test);
  var client = tester.service.randomService;
  return tester.start()
  .then(function() {
    return client.deleteUser(license2, '2db862c2-825c-4c2b-9cf4-26e16519e5f5').then(function(res) {
      t.fail('user has been deleted');
      return tester.stop();
    }).catch(function(err) {
      t.pass(err.message);
      return tester.stop();
    });
  });
});
