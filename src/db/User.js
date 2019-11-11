import * as SQLite from "expo-sqlite";
import util from "../util/util";

const db = SQLite.openDatabase("sigthstudy.db");

function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists user (id INTEGER PRIMARY KEY, nom VARCHAR(25), prenom VARCHAR(25), pin VARCHAR(255), type INTEGER , derniere_connexion DATE);"
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists score (id_user INTEGER, id_exo INTEGER, date DATE, score INTEGER );"
    );
  });
}

function getUser(nom, prenom) {
  db.transaction(tx => {
    tx.executeSql(
      "select id from user where nom=? and prenom=?;",
      [nom, prenom],
      (_, { rows }) => {
        if (rows._length > 0) {
          return rows._array[0].id;
        }
        throw new Error("L'utilisateur n'existe pas");
      }
    );
  });
}

function connexion(id, pin) {
  db.transaction(tx => {
    tx.executeSql("select pin from user where id=?;", [id], (_, { rows }) => {
      if (rows._length > 0) {
        dbpassword = rows._array[0].pin;
      } else throw new Error("L'utilisateur n'existe pas");
    });
  });
  sha1pin = util.SHA1(pin);
  if (sha1pin !== dbpassword) {
    throw new Error("Mauvais mot de passe");
  }

  date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  db.transaction(tx => {
    tx.executeSql("update user set derniere_connexion=? where id=?", [
      date,
      id
    ]);
  });
  return true;
}

function getType(id) {
  db.transaction(tx => {
    tx.executeSql("select type from user where id=?;", [id], (_, { rows }) => {
      if (rows._length > 0) {
        return rows._array[0].type;
      }
      throw new Error("L'utilisateur n'existe pas");
    });
  });
}

function getUsers() {
  db.transaction(tx => {
    tx.executeSql(
      "select id, nom, prenom, derniere_connexion from user;",
      [],
      (_, { rows }) => {
        console.log(rows);
        return rows;
      },
      console.error
    );
  });
}

function addUser(nom, prenom, pin, type) {
  var id;
  db.transaction(tx => {
    tx.executeSql(
      "select id from user;",
      [],
      (_, { rows }) => {
        id = rows.length;
      },
      console.error
    );
  });
  mdp = util.SHA1(pin);
  date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  db.transaction(tx => {
    tx.executeSql(
      "insert into user (id, nom, prenom, pin, type, derniere_connexion) values (?, ?, ?, ?, ?, ?);",
      [id, nom, prenom, mdp, type, date]
    );
  }, console.error);
}

function removeUser(id) {
  db.transaction(tx => {
    tx.executeSql("delete from user wher id=?;", [id]);
  });
}

function addScore(id, exo, score) {
  date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  db.transaction(tx => {
    tx.executeSql(
      "insert into score (id_user, id_exo, date, score) values (?,?,?,?);",
      [id, exo, date, score]
    );
  });
}

function getScore(user, exo) {
  db.transaction(tx => {
    tx.executeSql(
      "select date, score from score where id_user=? and id_exo=?;",
      [user, exo],
      (_, { rows }) => {
        return rows;
      }
    );
  });
}

function getExos(user) {
  db.transaction(tx => {
    tx.executeSql(
      "select id_exo from score where id_user=?;",
      [user],
      (_, { rows }) => {
        return rows;
      }
    );
  });
}

export {
  initDB,
  getUser,
  connexion,
  getType,
  getUsers,
  addUser,
  removeUser,
  addScore,
  getScore,
  getExos
};
