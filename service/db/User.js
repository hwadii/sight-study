import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("sigthstudy.db");

/**
 * Initialize database.
 */
export async function initDB() {
  // table users
  await _executeSql(
    "create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nom VARCHAR(25), prenom VARCHAR(25), sex VARCHAR(25), date_de_naissance DATE, distance FLOAT);"
  );
  // table score
  await _executeSql(
    "create table if not exists score (id_user INTEGER, date DATE, oeil_gauche INTEGER, oeil_droit INTEGER);"
  );
}

/**
 * Drops database.
 */
export async function dropDB() {
  await _executeSql("drop table user");
  await _executeSql("drop table score");
}

/**
 * Private generic function which executes an SQL statement.
 * @param {string} sqlStatement SQL query
 * @param {Array} params SQL query parameters
 * @returns {Promise} Promise which resolves to the result of the query.
 */
function _executeSql(sqlStatement, params = []) {
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
  if (!nom || !prenom) return null; // return early if null
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
  return _executeSql("select * from user where id=?;", [id]);
}

/**
 * Gets distance by id.
 *
 * @param {number} id user id.
 * @returns {Promise} Promise resolving to an array of users.
 */
export async function getDistance(id) {
  const result = await _executeSql("select distance from user where id=?;", [
    id
  ]);
  const { distance } = result.length > 0 ? result[0] : null;
  return distance;
}

/**
 * Set distance for a user.
 *
 * @param {number} id_user user id.
 * @param {number} distance left eye score.
 * @returns {Promise} Promise resolving to true if successful.
 */
export async function setDistance(id_user, distance) {
  return _executeSql("update user set distance=? where id=(?);", [
    distance,
    id_user
  ]);
}

/**
 * "Fuzzy search" through users.
 *
 * @param {string} recherche search term.
 * @returns {Promise} Promise resolving to users satisfiying the search terms.
 */
export function getUsersLike(recherche) {
  if (recherche.length > 0) {
    if (recherche.includes(" ")) {
      const recherche1 = recherche.split(" ")[0];
      const recherche2 = recherche.split(" ")[1];
      return _executeSql(
        "select * from user where (nom=? and prenom like ?) or (nom like ? and prenom=?) order by prenom ASC;",
        [recherche1, recherche2 + "%", recherche2 + "%", recherche1]
      );
    } else {
      return _executeSql(
        "select * from user where nom like ? or prenom like ? order by prenom ASC;",
        [recherche + "%", recherche + "%"]
      );
    }
  } else {
    return _executeSql("select * from user order by prenom ASC;", []);
  }
}

/**
 * Gets every user.
 *
 * @returns {Promise} Promise resolving to every user.
 */
export function getUsers() {
  return _executeSql("select * from user order by prenom ASC;", []);
}

/**
 * Adds user.
 *
 * @param {string} nom user's last name.
 * @param {string} prenom user's first name.
 * @param {string} sex user's sex.
 * @param {string} date_de_naissance user's date of birth.
 */
export function addUser(nom, prenom, sex, date_de_naissance, distance) {
  return _executeSql(
    "insert into user (nom, prenom, sex, date_de_naissance, distance) values (?,?,?,?,?);",
    [nom, prenom, sex, date_de_naissance, distance]
  );
}

/**
 * Removes user by id.
 *
 * @param {number} id user id.
 * @returns {Promise}
 */
export function removeUser(id) {
  return _executeSql("delete from user where id=?;", [id]);
}

/**
 * Adds score for a user.
 *
 * @param {number} id_user user id.
 * @param {number} oeil_gauche left eye score.
 * @param {number} oeil_droit right eye score.
 * @returns {Promise} Promise resolving to true if successful.
 */
export function addScore(id_user, oeil_gauche, oeil_droit) {
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
export function getScore(id) {
  return _executeSql(
    "select date, oeil_gauche, oeil_droit from score where id_user=? order by date ASC",
    [id]
  );
}

export function getScores() {
  return _executeSql(
    "select user.nom, user.prenom, score.id_user, score.date, score.oeil_gauche, score.oeil_droit from score inner join user on user.id=score.id_user"
  );
}
