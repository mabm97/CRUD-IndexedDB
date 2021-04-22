<%-- 
    Document   : indexedIO
    Created on : 21 abr 2021, 18:44:35
    Author     : PCio
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <button id = 'btnGetProducts' onclick='actualizarPrecios()'>Actualizar Precios</button>
        <button id = 'btnGetProducts' onclick='getUltimaFechaActualizacion()'>Obtener fecha version</button>
        <button id = 'btnGetProducts' onclick='getProductosTodos()'>Obtener Productos</button>
        <button id = 'btnGetProducts' onclick='getMisProductos()'>Obtener Mis Productos</button>
        <button id = 'btnGetProducts' onclick='addMisProductos()'>Agregar a Mis Productos</button>
        <button id = 'btnGetProducts' onclick='deleteMisProductos()'>Eliminar Producto</button>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="./indexedIO.js"></script>
        <script>
            let dbConfig = {
                dbName: "productosZen",
                dbVer: 1,
                stores: ["main", "versiones", "miLista"],
            };
            (function () {
                //<editor-fold defaultstate="collapsed" desc="Crear la base de datos y los file|tablas">                
                indexedDBModule.initDB(dbConfig.dbName, dbConfig.stores).then((respuesta) => {
                    console.log('Se creo la base de datos ', respuesta)
                }).catch((e) => {
                    console.log('Error al crear la base de datos', e)
                });
                //</editor-fold>
            })();
            function actualizarPrecios(e) {
                //<editor-fold defaultstate="collapsed" desc="Generated code">
                //<editor-fold defaultstate="collapsed" desc="Obtener Productos">
                var productos = $.ajax({
                    url: './Operacion',
                    type: 'GET',
                    dataType: 'json',
                    data: "idOperacion=obtenerProductos",
                    global: false,
                    async: false,
                    success: function (json) {
                        //console.log(json)
                        return json.objeto;
                    },
                    error: function (xhr, status) {
                        console.log(xhr, status)
                        console.log('Disculpe, existió un problema', xhr);
                    },
                    complete: function (xhr, status) {
                        console.log('Petición realizada');
                    }
                });
                //</editor-fold>
                productos = JSON.parse(productos.responseText).objeto
                //productos -> productos
                //fecha -> fecha
                //<editor-fold defaultstate="collapsed" desc="Actualizar los productos">
                let prod = new Object();
                prod.nombre = dbConfig.stores[0]
                prod.datos = productos.productos

                let storeWithData = []
                storeWithData.push(prod)

                let fechas = new Object()
                fechas.nombre = dbConfig.stores[1]
                fechas.datos = [{fecha: productos.fecha}]
                storeWithData.push(fechas)


                indexedDBModule.countItems(prod.nombre).then((res) => {
                    return res
                }).then((res) => {
                    if (parseInt(res.objeto) <= 0) {
                        indexedDBModule.createItems(storeWithData, false).then((res) => {
                        }).catch((e) => {
                            console.log('Error al registrar los elementos', e)
                        });
                    } else {
                        indexedDBModule.truncateStore(prod.nombre).then((res) => {
                            return res
                        }).then((res) => {
                            indexedDBModule.createItems(storeWithData, false).then((res) => {
                            }).catch((e) => {
                                console.log('Error al registrar los elementos', e)
                            });
                        }).catch((e) => {
                            console.log('Error al registrar los elementos', e)
                        });
                    }
                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });
                //</editor-fold>
                //</editor-fold>
            }
            ;
            function getProductosTodos(e) {
                indexedDBModule.readAllItems(dbConfig.stores[0]).then((res) => {
                    console.log('readAllItems');
                    console.log(res);
                    return res
                }).then((res) => {


                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });
            }
            ;
            function getUltimaFechaActualizacion(e) {
                indexedDBModule.readLastEntityId(dbConfig.stores[1]).then((res) => {
                    console.log('readLastEntityId');
                    console.log(res);
                    return res
                }).then((res) => {

                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });
            }
            ;
            function getMisProductos(e) {
                indexedDBModule.readAllItems(dbConfig.stores[2]).then((res) => {
                    console.log('readAllItems|Mis Producto');
                    console.log(res);
                    return res
                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });
            }
            ;
            function addMisProductos(e) {
                var productos = [
                    {key: 101, value: {
                            idPresentacion: "4ee6d72d-f14a-4529-b177-5af9f6d9b9e5",
                            idProducto: "c5ab729e-dc14-4c9e-9751-6d8ebea5a28f",
                            nombre: "Ablandador de carne 1 kg",
                            nombreNormalizado: " ablandador de carne 1 kg avlandador ablandador de sarne carne 1 kj kg",
                            precioVenta: "35.0",
                        }
                    },
                    {key: 102, value: {
                            idPresentacion: "66d99bfb-a942-41e5-a5e0-42b7ef03db69",
                            idProducto: "f4cdc5c9-e2b0-400f-9df1-873ef3ff85bc",
                            nombre: "Abriyantador para pan 1 kg",
                            nombreNormalizado: " abriyantador para pan 1 kg avrillantador abriyantador avriyantador abrillantador abriiantador para pan 1 kj kg",
                            precioVenta: "57.5",
                        }
                    },
                ];
                let storeWithData = []
                let prod = new Object();
                prod.nombre = dbConfig.stores[2]
                prod.datos = productos
                storeWithData.push(prod)

                indexedDBModule.createItems(storeWithData, false).then((res) => {
                    console.log('finalizacion de mis productos')
                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });

            }
            ;

            function deleteMisProductos(e) {
                var productos = [
                    {key: 101, value: {
                            idPresentacion: "4ee6d72d-f14a-4529-b177-5af9f6d9b9e5",
                            idProducto: "c5ab729e-dc14-4c9e-9751-6d8ebea5a28f",
                            nombre: "Ablandador de carne 1 kg",
                            nombreNormalizado: " ablandador de carne 1 kg avlandador ablandador de sarne carne 1 kj kg",
                            precioVenta: "35.0",
                        }
                    }
                    /*,
                     {key: 102, value: {
                     idPresentacion: "66d99bfb-a942-41e5-a5e0-42b7ef03db69",
                     idProducto: "f4cdc5c9-e2b0-400f-9df1-873ef3ff85bc",
                     nombre: "Abriyantador para pan 1 kg",
                     nombreNormalizado: " abriyantador para pan 1 kg avrillantador abriyantador avriyantador abrillantador abriiantador para pan 1 kj kg",
                     precioVenta: "57.5",
                     }
                     },
                     */
                ];

                let id = 101
                indexedDBModule.readAllItems(dbConfig.stores[2]).then((res) => {
                    let productosRespuesta = res.objeto
                    for (var item in productosRespuesta) {
                        let product = productosRespuesta[item]
                        if (product.value.key === id) {
                            indexedDBModule.deleteItem(product.key, dbConfig.stores[2]).then((res) => {
                                console.log('finalizacion de mis productos')
                            }).catch((e) => {
                                console.log('Error al registrar los elementos', e)
                            });
                            break
                        }
                    }
                }).catch((e) => {
                    console.log('Error al registrar los elementos', e)
                });
            }
            ;
        </script>



    </body>
</html>
