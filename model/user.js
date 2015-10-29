var crypto = require('crypto');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var model = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1
    },
    license: {
      type: DataTypes.UUID,
      allowNull: false
    },
    email: {
      // TODO: add a unique constraint
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    hash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      set: function(pwd) {
        var hash = crypto.createHash('sha1').update(pwd).digest('hex');
        this.setDataValue('password', pwd);
        this.setDataValue('hash', hash);
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 6) {
            throw new Error('Please choose a password longer than 6 characters');
          }
        }
      }
    },
    roles: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isValidRoles: function(roles) {

          if (roles === undefined || roles === null) {
            throw new Error('roles cannot be empty');
          }

          if (!(roles instanceof Array)) {
            throw new Error('roles is not an array');
          }

          if (_.isEmpty(roles)) {
            throw new Error('roles cannot be empty');
          }

          _.each(roles, function(role) {
            if (_.indexOf(['ChatOperator', 'KnowledgeOperator', 'Admin'], role) < 0) {
              throw new Error(role + ' is not a valid role');
            }
          });
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    groups: {
      type: DataTypes.JSON,
      allowNull: true
    }
  };

  return sequelize.define('User', model);
};
