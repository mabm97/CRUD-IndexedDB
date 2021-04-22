
import com.google.gson.Gson;
import iam.entidades.modulos.ModeloModuloEntidades;
import iam.entidades.modulos.ModeloModuloEntidadesException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import javax.sql.DataSource;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author PCio
 */
public class ModuloProductos extends ModeloModuloEntidades {

    public ModuloProductos(boolean modoDebug) {
        super(modoDebug);
    }

    public HashMap<String, Object> obtenerProductos(DataSource ds) throws ModeloModuloEntidadesException {
        ArrayList<ProductoPresentacionPersonalizado> productos = null;
        try {
            ProductoPresentacionPersonalizado p = new ProductoPresentacionPersonalizado();
            p.setOcultarParametrosEntidad(true);
            p.setConsultaPersonalizada("SELECT\n"
                    + "	ipp.id AS id_presentacion,\n"
                    + "	ipp.id_producto, ipp.nombre, ipp.nombre_normalizado,\n"
                    + "	ipp.precio_venta\n"
                    + "FROM productos_presentaciones AS ipp\n"
                    + "WHERE ipp.activo = true\n"
                    + "ORDER BY nombre\n"
                    + "LIMIT 100");
            productos = (ArrayList<ProductoPresentacionPersonalizado>) (ArrayList<?>) this.obtenerEntidadesConsultasPersonalizadas(ds, p);
        } catch (ModeloModuloEntidadesException exception) {
            throw new ModeloModuloEntidadesException("Error al obtener los productos", exception);
        }
        
        HashMap<String,Object> out = new HashMap();
        out.put("productos", productos);
        out.put("fecha", this.getCurrentDate());
        return out;

    }

    public static void main(String[] args) throws ModeloModuloEntidadesException {
        ModuloProductos m = new ModuloProductos(true);
        DataSource ds = ModeloModuloEntidades.generateDataSourcePostgreSQL("127.0.0.1", 5432, "pruebas", "postgres", "root", 1);

        System.out.println(new Gson().toJson(m.obtenerProductos(ds)));

    }

    private String getCurrentDate() {
        Date objDate = new Date(); // Sistema actual La fecha y la hora se asignan a objDate 

        System.out.println(objDate);
        String strDateFormat = "yyyy/mm/dd"; // El formato de fecha está especificado  
        SimpleDateFormat objSDF = new SimpleDateFormat(strDateFormat); // La cadena de formato de fecha se pasa como un argumento al objeto 
        System.out.println(objSDF.format(objDate)); // El formato de fecha se aplica a la fecha actual
        return objSDF.format(objDate);
    }

}
