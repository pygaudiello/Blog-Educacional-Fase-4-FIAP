const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_FILE || './database.sqlite'
});

const User = require('./user')(sequelize, DataTypes);
const Post = require('./post')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes);

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);
User.hasMany(Post);
Post.belongsTo(User, { as: 'owner' });

module.exports = { sequelize, Sequelize, Op, User, Post, Comment };
