/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import com.google.gson.Gson;
import iam.entidades.modulos.ModeloModuloEntidades;
import iam.entidades.modulos.ModeloModuloEntidadesException;
import iam.servlets.RespuestaGenericaJson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

/**
 *
 * @author PCio
 */
@WebServlet(urlPatterns = {"/Operacion"})
public class Operacion extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ModeloModuloEntidadesException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        Gson g = new Gson();
        String idOperacion = request.getParameter("idOperacion");
        DataSource ds = ModeloModuloEntidades.generateDataSourcePostgreSQL("localhost", 5432, "pruebas", "postgres", "root", 10);
        RespuestaGenericaJson a = new RespuestaGenericaJson();
        
        
        if (idOperacion.equalsIgnoreCase("obtenerProductos")) {
            try {
                a.setOperacionExitosa(true);
            a.setObjeto(new ModuloProductos(true).obtenerProductos(ds));
            } catch (Exception e) {
                if (e instanceof ModeloModuloEntidadesException) {
                    a.setMensaje( ((ModeloModuloEntidadesException) e).getCadenaSeguimiento()  );
                }
                a.setOperacionExitosa(false);
            }
        }
        
        out.write(new Gson().toJson(a));
        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ModeloModuloEntidadesException ex) {
            Logger.getLogger(Operacion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ModeloModuloEntidadesException ex) {
            Logger.getLogger(Operacion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
