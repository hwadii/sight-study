import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("sigthstudy.db");

function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nom VARCHAR(25), prenom VARCHAR(25), duplicata INTEGER, type INTEGER , derniere_connexion DATE);"
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists score (id_user INTEGER, date DATE, oeil_gauche INTEGER, oeil_droit INTEGER, Primary Key(`id_user`,`date`) );"
    );
  });
}

function dropDB() {
  db.transaction(tx => {
    tx.executeSql("drop table user");
  });
  db.transaction(tx => {
    tx.executeSql("drop table score");
  });
}

function getUser(nom, prenom, duplicata, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select id from user where nom=? and prenom=? and duplicata=?;",
        [nom, prenom, duplicata],
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

function getUserById(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select * from user where id=?;",
        [id],
        (_, {rows}) => {
          if (rows.length > 0) {
            callback(rows._array);
          }
        }
      );
    },
    console.error,
    console.log
  );
}

function getUsersLike(recherche, callback) {
  if (recherche.length > 0) {
    if (recherche.includes(" ")) {
      const recherche1 = recherche.split(" ")[0];
      const recherche2 = recherche.split(" ")[1];
      db.transaction(
        tx => {
          tx.executeSql(
            "select id, nom, prenom, duplicata, derniere_connexion from user where (nom=? and prenom like ?) or (nom like ? and prenom=?);",
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
            "select id, nom, prenom, duplicata, derniere_connexion from user where nom like ? or prenom like ?;",
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
          "select id, nom, prenom, duplicata, derniere_connexion from user;",
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

function getType(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select type from user where id=?;",
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            callback(rows._array[0].type);
          }
        }
      );
    },
    console.error,
    console.log
  );
}

function getUsers(callback) {
  db.transaction(tx => {
    tx.executeSql(
      "select id, nom, prenom, duplicata, derniere_connexion from user;",
      [],
      (_, { rows }) => {
        callback(rows._array);
      },
      console.error
    );
  });
}

function addUser(nom, prenom, type, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select duplicata from user where nom=? and prenom=?;",
        [nom, prenom],
        (_, { rows }) => {
          const duplicata = parseInt(rows.length);
          addUser_onSuccess(nom, prenom, duplicata, type, callback);
        }
      );
    },
    console.error,
    console.log
  );
}

function addUser_onSuccess(nom, prenom, duplicata, type, callback) {
  const date = new Date().toLocaleDateString("fr-FR");
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into user (nom, prenom, duplicata, type, derniere_connexion) values (?,?,?,?,?);",
        [nom, prenom, duplicata, type, date]
      );
    },
    console.error,
    callback
  );
}

function removeUser(id, callback) {
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

function addScore(id_user, oeil_gauche, oeil_droit, callback) {
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

function getScore(user, callback) {
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

export {
  initDB,
  dropDB,
  getUser,
  getUserById,
  getUsersLike,
  getType,
  getUsers,
  addUser,
  removeUser,
  addScore,
  getScore
};
