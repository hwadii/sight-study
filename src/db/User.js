import * as SQLite from "expo-sqlite";
import util from "../util/util";

const db = SQLite.openDatabase("sigthstudy.db");

// TODO: enlever le code pin

function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nom VARCHAR(25), prenom VARCHAR(25), duplicata INTEGER, pin VARCHAR(255), type INTEGER , derniere_connexion DATE);"
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
        (_, {rows}) => {
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

function getUsersLike(recherche, callback) {
  recherche = String(recherche)
  if (recherche.length>0){
    if (recherche.includes(" ")){
      var recherche1 = recherche.split(' ')[0]
      var recherche2 = recherche.split(' ')[1]
      console.log(recherche1 + 'a')
      console.log(recherche2 + 'a')
      db.transaction(
        tx => {
          tx.executeSql(
            "select id, nom, prenom, duplicata, derniere_connexion from user where (nom=? and prenom like ?) or (nom like ? and prenom=?);",
            [recherche1, recherche2 + '%', recherche2 + '%', recherche1],
            (_, {rows}) => {
              callback(rows._array);
            }
          );
        },
        console.error,
        console.log
      );

    }else{
      db.transaction(
        tx => {
          tx.executeSql(
            "select id, nom, prenom, duplicata, derniere_connexion from user where nom like ? or prenom like ?;",
            [recherche + '%', recherche + '%'],
            (_, {rows}) => {
              callback(rows._array);
            }
          );
        },
        console.error,
        console.log
      );

    }
  }
  else{
    db.transaction(
      tx => {
        tx.executeSql(
          "select id, nom, prenom, duplicata, derniere_connexion from user;",
          [],
          (_, {rows}) => {
            callback(rows._array);
          }
        );
      },
      console.error,
      console.log
    );
  }
}

function connexion(id, pin, callback) {
  db.transaction(
    tx => {
      tx.executeSql("select pin from user where id=?;", [id], (_, {rows}) => {
        if (rows.length > 0) {
          const dbpassword = rows._array[0].pin;
          connexion_onSuccess(id, pin, dbpassword, callback);
        }
      });
    },
    console.error,
    console.log
  );
}

function connexion_onSuccess(id, pin, dbpassword, callback) {
  const sha1pin = util.SHA1(String(pin));
  if (sha1pin == dbpassword) {
    const date = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    db.transaction(
      tx => {
        tx.executeSql(
          "update user set derniere_connexion=? where id=?",
          [date, id],
          callback(true)
        );
      },
      console.error,
      console.log
    );
  } else {
    callback(false);
  }
}

function getType(id, callback) {
  db.transaction(
    tx => {
      tx.executeSql("select type from user where id=?;", [id], (_, {rows}) => {
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
      (_, {rows}) => {
        callback(rows._array);
      },
      console.error
    );
  });
}

function addUser(nom, prenom, pin, type, callback) {
  db.transaction(
    tx => {
      tx.executeSql(
        "select duplicata from user where nom=? and prenom=?;",
        [nom, prenom],
        (_, {rows}) => {
          duplicata = parseInt(rows.length);
          addUser_onSuccess(nom, prenom, duplicata, pin, type, callback);
        }
      );
    },
    console.error,
    console.log
  );
}

function addUser_onSuccess(nom, prenom, duplicata, pin, type, callback) {
  const mdp = util.SHA1(String(pin));
  const date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  console.log(nom)
  console.log(duplicata)
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into user (nom, prenom, duplicata, pin, type, derniere_connexion) values (?,?,?,?,?,?);",
        [nom, prenom, duplicata, mdp, type, date],
        callback
      );
    },
    console.error,
    console.log
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
  const date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
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
        (_, {rows}) => {
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
  getUsersLike,
  connexion,
  getType,
  getUsers,
  addUser,
  removeUser,
  addScore,
  getScore,
};
