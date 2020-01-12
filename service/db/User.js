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
 * @param {function} callback callback to be called after getting a user.
 */
export function getUser(nom, prenom, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select id from user where nom=? and prenom=?;",
        [nom, prenom],
        (_, { rows }) => {
          if (rows.length > 0) {
            callback(rows._array[0].id);
          }
        }
      );
    },
    console.error,
    console.log
  );
}

/**
 * Gets user by id.
 *
 * @param {number} id user id.
 * @param {function} callback callback to be called after getting a user by id.
 */
export function getUserById(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql("select * from user where id=?;", [id], (_, { rows }) => {
        if (rows.length > 0) {
          callback(rows._array);
        }
      });
    },
    console.error,
    console.log
  );
}


/**
 * "Fuzzy search" through users.
 *
 * @param {string} recherche search term.
 * @param {function} callback callback to be called after getting a user.
 */
export function getUsersLike(recherche, callback) {
  if (recherche.length > 0) {
    if (recherche.includes(" ")) {
      const recherche1 = recherche.split(" ")[0];
      const recherche2 = recherche.split(" ")[1];
      db.transaction(
        tx => {
          tx.executeSql(
            "select id, nom, prenom, derniere_connexion from user where (nom=? and prenom like ?) or (nom like ? and prenom=?) order by prenom ASC;",
            [recherche1, recherche2 + "%", recherche2 + "%", recherche1],
            (_, { rows }) => {
              callback(rows._array);
            }
          );
        },
        console.error,
        console.log
      );
    } else {
      db.transaction(
        tx => {
          tx.executeSql(
            "select id, nom, prenom, derniere_connexion from user where nom like ? or prenom like ?;",
            [recherche + "%", recherche + "%"],
            (_, { rows }) => {
              callback(rows._array);
            }
          );
        },
        console.error,
        console.log
      );
    }
  } else {
    db.transaction(
      tx => {
        tx.executeSql(
          "select id, nom, prenom, derniere_connexion from user;",
          [],
          (_, { rows }) => {
            callback(rows._array);
          }
        );
      },
      console.error,
      console.log
    );
  }
}

/**
 * Gets every user.
 *
 * @param {function} callback callback to be called after getting users.
 */
export function getUsers(callback) {
  db.transaction(tx => {
    tx.executeSql(
      "select id, nom, prenom, derniere_connexion, sex, date_de_naissance from user order by prenom ASC;",
      [],
      (_, { rows }) => {
        callback(rows._array);
      },
      console.error
    );
  });
}

/**
 * Adds user.
 *
 * @param {string} nom user's last name.
 * @param {string} prenom user's first name.
 * @param {string} sex user's sex.
 * @param {string} date_de_naissance user's date of birth.
 * @param {function} callback callback to be called after adding user.
 */
export function addUser(nom, prenom, sex, date_de_naissance, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into user (nom, prenom, sex, date_de_naissance) values (?,?,?,?);",
        [nom, prenom, sex, date_de_naissance]
      );
    },
    console.error,
    callback
  );
}

/**
 * Removes user by id.
 *
 * @param {number} id user id.
 * @param {function} callback callback to be called after getting a user by id.
 */
export function removeUser(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "delete from user where id=?;",
        [id],
        callback(true),
        callback(false)
      );
    },
    console.error,
    console.log
  );
}

/**
 * Adds score for a user.
 *
 * @param {number} id_user user id.
 * @param {number} oeil_gauche left eye score.
 * @param {number} oeil_droit right eye score.
 * @param {function} callback callback to be called after adding a score.
 */
export function addScore(id_user, oeil_gauche, oeil_droit, callback) {
  const date = new Date().toLocaleDateString("fr-FR");
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into score (id_user, date, oeil_gauche, oeil_droit) values (?,?,?,?);",
        [id_user, date, oeil_gauche, oeil_droit]
      );
    },
    console.error,
    console.log
  );
  callback(true);
}

/**
 * Gets score for a user.
 *
 * @param {number} id user id.
 * @param {function} callback callback to be called after adding a score.
 */
export function getScore(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select date, oeil_gauche, oeil_droit from score where id_user=? order by date ASC",
        [id],
        (_, { rows }) => {
          callback(rows._array);
        }
      );
    },
    console.error,
    console.log
  );
}
