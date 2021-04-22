/**
 * @author Marco Antonio Barrios Molina | El Joju | chinelo.io
 */



/* -------------------------- */
/* myindexedDB
 /* -------------------------- */

let indexedDBModule = (function () {

//Referencia del nombre de la base de datos
    let dbName;

//Permisos del navegador
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    let IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    /**
     * Se inicializa la Base de Datos
     * @param {String} db Nombre de la Base de Datos
     * @param {Array(String) store 
     * @returns {Promise} TRUE se creo correctamente la Base de Datos
     */
    function initDB(db, store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            if (!indexedDB) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento('El Navegador no soporta la Base de Datos IndexedDB')
                reject(respuesta)
            } else {
                //initDB(db, store);
                try {
                    var dbOpenRequest = indexedDB.open(db, 1);
                    dbOpenRequest.onsuccess = function (event) {
                        console.log('La Base de Datos con nombre: ' + db + ', fue creada con los store: ' + store);
                        dbName = db;
                    };
                    dbOpenRequest.onupgradeneeded = function (e) {
                        var thisDB = dbOpenRequest.result;
                        var transaction = dbOpenRequest.transaction;
                        try {
                            //Todos los store seran creados con una KEY de tipo AUTO_INCREMENTABLE
                            var storeOptions = {autoIncrement: true};
                            for (var item in store) {
                                //Se crean todos los Store
                                var objectStore = thisDB.createObjectStore(store[item], storeOptions);
                            }
                            respuesta.operacionExitosa = false
                            respuesta.objeto = true
                            resolve(respuesta)
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento('Ocurrio un error al crear los store en la Base de Datos: ', e)
                            reject(respuesta)
                        }
                    };
                    dbOpenRequest.onerror = function (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento('Ocurrio un error durante la conexion a la Base de Datos durante la creacion de los store: ', e)
                        reject(respuesta)
                    };
                    dbOpenRequest.onblocked = function (e) {
                        console.log('Blocked ');
                    };
                } catch (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento('Ocurrio un error al crear los store ', e)
                    reject(respuesta)
                }
            }
        });
    }

    /******** helpers **********/

    return{
        initDB: initDB
                /**,
                 destroy: destroy,
                 createItem: createItem,
                 readItem: readItem,
                 updateItem: updateItem,
                 deleteItem: deleteItem,
                 readLastEntityId: readLastEntityId,
                 insertItems: insertItems,
                 readAllKey: readAllKey,
                 readAllItems: readAllItems,
                 countItems: countItems,
                 deleteAllItems: deleteAllItems
                 * 
                 */
    };
}());