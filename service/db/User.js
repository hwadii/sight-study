import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("sigthstudy.db");

/**
 * Initialize database.
 */
export function initDB() {
  // table users
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nom VARCHAR(25), prenom VARCHAR(25), derniere_connexion DATE, sex VARCHAR(25), date_de_naissance DATE);"
    );
  });
  // table score
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists score (id_user INTEGER, date DATE, oeil_gauche INTEGER, oeil_droit INTEGER);"
    );
  });
}

/**
 * Drops database.
 */
export function dropDB() {
  db.transaction(tx => {
    tx.executeSql("drop table user");
  });
  db.transaction(tx => {
    tx.executeSql("drop table score");
  });
}

/**
 * Private generic function which executes an SQL statement.
 * @param {string} sqlStatement SQL query
 * @param {Array} params SQL query parameters
 * @returns {Promise} Promise which resolves to the result of the query.
 */
async function _executeSql(sqlStatement, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sqlStatement,
        params,
        (_, { rows }) => resolve(rows._array),
        reject
      );
    });
  });
}

/**
 * Resets database.
 */
export function resetDB() {
  dropDB();
  initDB();
}

/**
 * Gets user.
 *
 * @param {string} nom last name of the user.
 * @param {string} prenom first name of the user.
 * @returns {Promise} Promise reolving to user id or null if user does not exist.
 */
export async function getUser(nom, prenom) {
  const usersWithId = await _executeSql(
    "select id from user where nom=? and prenom=?;",
    [nom, prenom]
  );
  return usersWithId.length ? usersWithId[0].id : null;
}

/**
 * Gets user by id.
 *
 * @param {number} id user id.
 * @returns {Promise} Promise resolving to an array of users.
 */
export async function getUserById(id) {
  return await _executeSql("select * from user where id=?;", [id]);
}

/**
 * "Fuzzy search" through users.
 *
 * @param {string} recherche search term.
 * @returns {Promise} Promise resolving to users satisfiying the search terms.
 */
export async function getUsersLike(recherche) {
  if (recherche.length > 0) {
    if (recherche.includes(" ")) {
      const recherche1 = recherche.split(" ")[0];
      const recherche2 = recherche.split(" ")[1];
      return await _executeSql(
        "select id, nom, prenom, sex from user where (nom=? and prenom like ?) or (nom like ? and prenom=?) order by prenom ASC;",
        [recherche1, recherche2 + "%", recherche2 + "%", recherche1]
      );
    } else {
      return await _executeSql(
        "select id, nom, prenom, sex from user where nom like ? or prenom like ?;",
        [recherche + "%", recherche + "%"]
      );
    }
  } else {
    return await _executeSql("select id, nom, prenom, sex from user;", []);
  }
}

/**
 * Gets every user.
 *
 * @returns {Promise} Promise resolving to every user.
 */
export async function getUsers() {
  return await _executeSql(
    "select id, nom, prenom, sex, date_de_naissance from user order by prenom ASC;",
    []
  );
}

/**
 * Adds user.
 *
 * @param {string} nom user's last name.
 * @param {string} prenom user's first name.
 * @param {string} sex user's sex.
 * @param {string} date_de_naissance user's date of birth.
 */
export async function addUser(nom, prenom, sex, date_de_naissance) {
  await _executeSql(
    "insert into user (nom, prenom, sex, date_de_naissance) values (?,?,?,?);",
    [nom, prenom, sex, date_de_naissance]
  );
}

/**
 * Removes user by id.
 *
 * @param {number} id user id.
 * @returns {Promise} Promise resolving to true if successful.
 */
export async function removeUser(id) {
  /**
   * @type {Array}
   */
  const result = await _executeSql("delete from user where id=?;", [id]);
  return !!result.length;
}

/**
 * Adds score for a user.
 *
 * @param {number} id_user user id.
 * @param {number} oeil_gauche left eye score.
 * @param {number} oeil_droit right eye score.
 * @returns {Promise} Promise resolving to true if successful.
 */
export async function addScore(id_user, oeil_gauche, oeil_droit) {
  const date = new Date().toLocaleDateString("fr-FR");
  const isSuccess = _executeSql(
    "insert into score (id_user, date, oeil_gauche, oeil_droit) values (?,?,?,?);",
    [id_user, date, oeil_gauche, oeil_droit]
  );
  return !!isSuccess;
}

/**
 * Gets score for a user.
 *
 * @param {number} id user id.
 * @returns {Promise} Promise that resolves to score of user `id`.
 */
export async function getScore(id) {
  return await _executeSql(
    "select date, oeil_gauche, oeil_droit from score where id_user=? order by date ASC",
    [id]
  );
}
