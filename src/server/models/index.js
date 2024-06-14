const Book = require("./Book");
const User = require("./User");
const UserReadingList = require("./ReadingList");
const ReadBooksList = require("./ReadBooksList");
const ActiveToken = require("./ActiveToken");

User.belongsToMany(Book, { through: ReadBooksList, as: "read_books" });
Book.belongsToMany(User, { through: ReadBooksList, as: "read_by_user" });

ReadBooksList.belongsTo(Book)
Book.hasMany(ReadBooksList)

User.belongsToMany(Book, { through: UserReadingList, as: "marked_books" });
Book.belongsToMany(User, { through: UserReadingList, as: "users_marked" });

module.exports = {
  Book,
  User,
  UserReadingList,
  ReadBooksList,
  ActiveToken,
};
