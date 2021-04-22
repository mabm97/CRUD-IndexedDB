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
                respuesta.cadenaSeguimiento = ('El Navegador no soporta la Base de Datos IndexedDB')
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
                            //var storeOptions = {autoIncrement: true};
                            var storeOptions = {autoIncrement: true}
                            for (var item in store) {
                                //Se crean todos los Store
                                var objectStore = thisDB.createObjectStore(store[item], storeOptions);
                            }
                            respuesta.operacionExitosa = true
                            respuesta.objeto = true
                            resolve(respuesta)
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento = ('Ocurrio un error al crear los store en la Base de Datos: ', e)
                            reject(respuesta)
                        }
                    };
                    dbOpenRequest.onerror = function (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la conexion a la Base de Datos durante la creacion de los store: ', e)
                        reject(respuesta)
                    };
                    dbOpenRequest.onblocked = function (e) {
                        console.log('Blocked ');
                    };
                } catch (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error al crear los store ', e)
                    reject(respuesta)
                }
            }
        });
    }

    /**
     * Registra valores a los store
     * @param {type} storeWithData
     * @param {type} update TRUE: sera una actualizacion de datos, FALSE: sera insercion de datos
     * @returns {Promise}
     */
    function createItems(storeWithData, update) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        for (let item in storeWithData) {
                            let nombreStore = storeWithData[item].nombre
                            let datosItem = storeWithData[item].datos

                            let transaction = thisDB.transaction([nombreStore], "readwrite");
                            transaction.oncomplete = function (e) {
                                console.log('transaction is complete ');
                            };
                            transaction.onabort = function (e) {
                                let error = e.target.error; // DOMError
                                if (error.name == 'QuotaExceededError') {
                                    alert('createItem -> transaction[' + nombreStore + '] -> onabort - QuotaExceededError ');
                                }
                                console.log('transaction aborted ');
                            };
                            transaction.onerror = function (e) {
                                console.log('transaction error');
                            };

                            let request;
                            let objectStore = transaction.objectStore(nombreStore);

                            for (var i = 0; i < datosItem.length; i++) {
                                if (update && update == true) {
                                    request = objectStore.put(datosItem[i]);
                                } else {
                                    request = objectStore.add(datosItem[i]);
                                }
                                request.onsuccess = function (event) {
                                };
                                request.onerror = function (event) {
                                    if (update && update == true) {
                                        console.log('Error. Could not update record with id = ' + id);
                                    } else {
                                        console.log('Error ' + event + ' This record is already in the database. ');
                                    }
                                };
                            }
                        }
                        respuesta.operacionExitosa = true
                        respuesta.objeto = true
                        resolve(respuesta)
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la insercion de los elementos: ', e)
                        reject(respuesta)
                    }
                    ;
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la insercion de los elementos: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la insercion de los elementos: ', e)
                reject(respuesta)
            }
            ;
        });
    }
    ;

    /**
     * Registra valores a los store
     * @param {type} storeWithData
     * @param {type} update TRUE: sera una actualizacion de datos, FALSE: sera insercion de datos
     * @returns {Promise}
     */
    function truncateStore(store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        let transaction = thisDB.transaction([store], "readwrite");
                        transaction.oncomplete = function (e) {
                            console.log('transaction is complete ');
                        };
                        transaction.onabort = function (e) {
                            let error = e.target.error; // DOMError
                            if (error.name == 'QuotaExceededError') {
                                console('createItem -> transaction[' + store + '] -> onabort - QuotaExceededError ');
                            }
                            console.log('transaction aborted ');
                        };
                        transaction.onerror = function (e) {
                            console.log('transaction error');
                        };

                        let request;
                        let objectStore = transaction.objectStore(store);
                        var objectStoreRequest = objectStore.clear();
                        objectStoreRequest.onsuccess = function (event) {
                            // report the success of our request
                            respuesta.operacionExitosa = true
                            respuesta.objeto = true
                            resolve(respuesta)
                        };
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la limpieza del store: ', e)
                        reject(respuesta)
                    }
                    ;
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la limpieza del store: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la limpieza del store: ', e)
                reject(respuesta)
            }
            ;
        });
    }
    ;
    /**
     * Cuenta todos los registros de un store
     * @param {type} store nombre del store a contar
     * @returns {Promise}
     */
    function countItems(store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        let transaction = thisDB.transaction([store], "readonly");
                        transaction.oncomplete = function (e) {
                            console.log('transaction is complete ');
                        };
                        transaction.onabort = function (e) {
                            console.log('transaction aborted ');
                        };
                        transaction.onerror = function (e) {
                            console.log('transaction error ');
                        };
                        try {
                            let objectStore = transaction.objectStore(store);
                            let request = objectStore.count();
                            request.onsuccess = function (event) {
                                let element = event.target.result;
                                if (element !== undefined) {
                                    respuesta.operacionExitosa = true
                                    respuesta.objeto = JSON.stringify(element)
                                    resolve(respuesta)
                                } else {
                                    respuesta.operacionExitosa = true
                                    respuesta.cadenaSeguimiento = ('Ocurrio un error al contar los elementos: ', 'isEmpty')
                                    resolve(respuesta)
                                }
                            };
                            request.onerror = function (event) {
                                respuesta.operacionExitosa = false
                                respuesta.objeto = false
                                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                                reject(respuesta)
                            };
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar, no existe el store: ', e)
                            reject(respuesta)
                        }
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                        reject(respuesta)
                    }
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la conexion a la base de datos: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request is blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante el conteo de elementos: ', e)
                reject(respuesta)
            }
            ;




        });
    }
    ;

    function readAllItems(store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        let transaction = thisDB.transaction([store], "readonly");
                        transaction.oncomplete = function (e) {
                            console.log('transaction is complete ');
                        };
                        transaction.onabort = function (e) {
                            console.log('transaction aborted ');
                        };
                        transaction.onerror = function (e) {
                            console.log('transaction error ');
                        };
                        try {
                            let objectStore = transaction.objectStore(store);
                            let request = objectStore.openCursor();
                            let resultado = []
                            request.onsuccess = function (event) {
                                let cursor = event.target.result;
                                if (cursor) {
                                    const r = cursor;
                                    let obj = new Object()
                                    obj.key = r.key
                                    obj.value = r.value
                                    resultado.push(obj)
                                    cursor.continue();
                                } else {
                                    respuesta.operacionExitosa = true
                                    respuesta.objeto = resultado
                                    resolve(respuesta)
                                }
                            };
                            request.onerror = function (event) {
                                respuesta.operacionExitosa = false
                                respuesta.objeto = false
                                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                                reject(respuesta)
                            };
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar, no existe el store: ', e)
                            reject(respuesta)
                        }
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                        reject(respuesta)
                    }
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la conexion a la base de datos: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request is blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante el conteo de elementos: ', e)
                reject(respuesta)
            }
            ;
        });
    }
    ;

    function readLastEntityId(store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        let transaction = thisDB.transaction([store], "readonly");
                        transaction.oncomplete = function (e) {
                            console.log('transaction is complete ');
                        };
                        transaction.onabort = function (e) {
                            console.log('transaction aborted ');
                        };
                        transaction.onerror = function (e) {
                            console.log('transaction error ');
                        };
                        try {
                            let objectStore = transaction.objectStore(store);
                            let request = objectStore.openCursor(null, 'prev');
                            let resultado = null
                            request.onsuccess = function (event) {
                                let cursor = event.target.result;
                                resultado = new Object
                                resultado.key = cursor.key
                                resultado.value = cursor.value

                                respuesta.operacionExitosa = true
                                respuesta.objeto = resultado
                                resolve(respuesta)

                            };
                            request.onerror = function (event) {
                                respuesta.operacionExitosa = false
                                respuesta.objeto = false
                                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                                reject(respuesta)
                            };
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar, no existe el store: ', e)
                            reject(respuesta)
                        }
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store a buscar: ', e)
                        reject(respuesta)
                    }
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la conexion a la base de datos: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request is blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la obtencion del ultimo elemento: ', e)
                reject(respuesta)
            }
            ;
        });
    }
    ;

    var deleteItem = function (id, store) {
        return new Promise((resolve, reject) => {
            let respuesta = new Object()
            try {
                let dbOpenRequest = indexedDB.open(dbName);
                dbOpenRequest.onsuccess = function (event) {
                    let thisDB = dbOpenRequest.result;
                    try {
                        let transaction = thisDB.transaction([store], "readwrite");
                        transaction.oncomplete = function (e) {
                            console.log('transaction is complete ');
                        };
                        transaction.onabort = function (e) {
                            console.log('transaction aborted ');
                        };
                        transaction.onerror = function (e) {
                            console.log('Transaction error -> [deleteItem] ');
                        };
                        try {
                            let objectStore = transaction.objectStore(store);
                            let getRequest = objectStore.get(id);
                            getRequest.onsuccess = function (e) {
                                if (e.target.result != null) {
                                    let request = objectStore.delete(id);
                                    request.onsuccess = function (event) {
                                        respuesta.operacionExitosa = true
                                        respuesta.objeto = true
                                        resolve(respuesta)
                                    };
                                    request.onerror = function (event) {
                                        respuesta.operacionExitosa = true
                                        respuesta.objeto = null
                                        respuesta.cadenaSeguimiento = 'Ocurrio un error al eliminar el elemennot',event
                                        reject(respuesta)
                                    };
                                } else {
                                    respuesta.operacionExitosa = true
                                    respuesta.objeto = null
                                    resolve(respuesta)
                                }
                            };
                            getRequest.onerror = function (e) {
                                console.log('Error [deleteItem] -> delete(' + id + ') ');
                            };
                        } catch (e) {
                            respuesta.operacionExitosa = false
                            respuesta.objeto = false
                            respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store, no se encuentra creado el store: ', e)
                            reject(respuesta)
                        }
                    } catch (e) {
                        respuesta.operacionExitosa = false
                        respuesta.objeto = false
                        respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion del store: ', e)
                        reject(respuesta)
                    }
                };
                dbOpenRequest.onupgradeneeded = function (e) {
                    console.log('Database upgrade needed ');
                };
                dbOpenRequest.onerror = function (e) {
                    respuesta.operacionExitosa = false
                    respuesta.objeto = false
                    respuesta.cadenaSeguimiento = ('Ocurrio un error durante la inicializacion de la conexion: ', e)
                    reject(respuesta)
                };
                dbOpenRequest.onblocked = function (e) {
                    console.log('Database open request is blocked ');
                };
            } catch (e) {
                respuesta.operacionExitosa = false
                respuesta.objeto = false
                respuesta.cadenaSeguimiento = ('Ocurrio un error durante la obtencion del elemento: ', e)
                reject(respuesta)
            }
        });
    };


    /******** helpers **********/

    return{
        initDB: initDB,
        createItems: createItems,
        countItems: countItems,
        truncateStore: truncateStore,
        readAllItems: readAllItems,
        readLastEntityId: readLastEntityId,
        deleteItem: deleteItem,
        /**,
         destroy: destroy,
         updateItem: updateItem,
         insertItems: insertItems,
         readAllKey: readAllKey,
         readAllItems: readAllItems,
         deleteAllItems: deleteAllItems
         */
    };
}());