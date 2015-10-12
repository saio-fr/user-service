var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var model = {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    license: {
      type: DataTypes.UUID,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
