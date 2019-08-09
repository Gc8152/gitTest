package com.yusys.Utils;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Clob;

/**
 * response工具类.
 * User: wuxw
 * Date: 15-11-2
 * Time: AM9:23
 */
public class ResponseUtils {
    private static final Logger logger = Logger.getLogger(ResponseUtils.class);

    /**
     * 获取接口返回成功的标准格式
     * @param message 成功信息
     * @return
     */
    public static String jsonSuccess(String message) {
        JSONObject jsonSuccess=new JSONObject();
        jsonSuccess.put("success",message);
        return  jsonSuccess.toString();
    }

    /**
     * 获取接口返回失败的基本格式
     * @param message 失败提示信息
     * @return
     */
    public static String jsonError(String message) {
        JSONObject jsonError=new JSONObject();
        jsonError.put("error",message);
        return  jsonError.toString();
    }

    /**
     * 封装获取key操作步骤
     * @param res
     * @param req
     * @param message
     */
    public static void jsonEncryptMessage(HttpServletResponse res,HttpServletRequest req,String message){
        String key = req.getParameter("YX_SID");
        jsonEncryptMessage( res, message, key);
    }
    /**
     *   输出加密的字符串
     * @param res
     * @param message 标准的JOSN信息
     * @param key 加密串
     * @throws Exception
     */
    public static void jsonEncryptMessage(HttpServletResponse res,String message,String key) {
        try {
            if (SysConfigUtils.dataIsEncrypt()) {
                jsonMessage(res, DES.encrypt(message, key));
            } else {
                jsonMessage(res, message);
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e);
        }
    }

    /**
     * 输出Json信息
     * @param res
     * @param message 标准的JOSN信息
     * @throws IOException
     */
    public static void jsonMessage(HttpServletResponse res,String message) {
        res.setCharacterEncoding("UTF-8");
        res.setContentType("text/html;charset=UTF-8");
        PrintWriter printWriter = null;
        try {
            printWriter = res.getWriter();
            printWriter.print(message);
        } catch (IOException e) {
            e.printStackTrace();
            logger.error(e);
        } finally {
            if (null != printWriter) {
                printWriter.close();
            }
        }
    }
    
    /**
     * oracle Clob类型 转字符串
     * @param clob
     * @return
     * @throws Exception
     */
    public static String oracleClob2Str(Object object) throws Exception {
    	if(object instanceof Clob){
    		Clob clob=(Clob)object;
    		return (clob != null ? clob.getSubString(1, (int) clob.length()) : null); 
    	}
    	if (object==null) {
			return "";
		}
    	return object.toString();
    }

}
