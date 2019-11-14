import * as SQLite from "expo-sqlite";
import util from "../util/util";

const db = SQLite.openDatabase("sigthstudy.db");

function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nom VARCHAR(25), prenom VARCHAR(25), duplicata INTEGER, pin VARCHAR(255), type INTEGER , derniere_connexion DATE);"
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists score (id_user INTEGER, id_exo INTEGER, date DATE, score INTEGER );"
    );
  });
}

function dropDB() {
  db.transaction(tx => {
    tx.executeSql(
      "drop table user"
    );
  });
  db.transaction(tx => {
    tx.executeSql(
      "drop table score"
    );
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

function connexion(id, pin, callback) {
  db.transaction(tx => {
    tx.executeSql("select pin from user where id=?;", [id], (_, { rows }) => {
      if (rows.length > 0) {
        dbpassword = rows._array[0].pin;
        connexion_onSuccess(id, pin, dbpassword, callback)
      }
    });
  },
  console.error,
  console.log
  );
}

function connexion_onSuccess(id, pin, dbpassword, callback){
  sha1pin = util.SHA1(String(pin));
  if (sha1pin == dbpassword) {
    date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    db.transaction(tx => {
      tx.executeSql("update user set derniere_connexion=? where id=?", [
        date,
        id
      ]);
    },
    console.error,
    console.log
    );
    callback(true)   
  }else{
    callback(false)
  }
}

function getType(id, callback) {
  db.transaction(tx => {
    tx.executeSql("select type from user where id=?;", [id], (_, { rows }) => {
      if (rows.length > 0) {
        callback(rows._array[0].type);
      }
    });
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

var duplicata
function addUser(nom, prenom, pin, type, callback) {
  db.transaction(tx => {
    tx.executeSql("select duplicata from user where nom=? and prenom=?;", 
      [nom, prenom],
      (_, { rows }) => {
        duplicata = parseInt(rows.length);
    });
  },
  console.error,
  console.log
  );
  addUser_onSuccess(nom, prenom, pin, type, callback)

}

function addUser_onSuccess(nom, prenom, pin, type, callback){
  mdp = util.SHA1(String(pin));

  date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  
  db.transaction(tx => {
    tx.executeSql(
      "insert into user (nom, prenom, duplicata, pin, type, derniere_connexion) values (?,?,?,?,?,?);",
      [nom, prenom, duplicata, mdp, type, date]
    );
  },
  console.error,
  console.log
  );
  callback(true)   
}

function removeUser(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql("delete from user where id=?;", [id]);
    },
    console.error,
    console.log
  );
  callback(true)
}

function addScore(id, exo, score, callback) {
  date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  db.transaction(tx => {
    tx.executeSql(
      "insert into score (id_user, id_exo, date, score) values (?,?,?,?);",
      [id, exo, date, score]
    );
  },
  console.error,
  console.log
  );
  callback(true)
}

function getScore(user, exo, callback) {
  db.transaction(tx => {
    tx.executeSql(
      "select date, score from score where id_user=? and id_exo=?;",
      [user, exo],
      (_, { rows }) => {
        callback(rows._array);
      }
    );
  },
  console.error,
  console.log
  );
}

function getExos(user, callback) {
  db.transaction(tx => {
    tx.executeSql(
      "select id_exo from score where id_user=?;",
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
  connexion,
  getType,
  getUsers,
  addUser,
  removeUser,
  addScore,
  getScore,
  getExos
};
