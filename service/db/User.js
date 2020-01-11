import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("sigthstudy.db");

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

export function dropDB() {
  db.transaction(tx => {
    tx.executeSql("drop table user");
  });
  db.transaction(tx => {
    tx.executeSql("drop table score");
  });
}

export function resetDB() {
  dropDB();
  initDB();
}

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

export function getScore(user, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select date, oeil_gauche, oeil_droit from score where id_user=? order by date ASC",
        [user],
        (_, { rows }) => {
          callback(rows._array);
        }
      );
    },
    console.error,
    console.log
  );
}
