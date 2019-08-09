package com.yusys.Utils;

import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: wuxw
 * Date: 15-11-9
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */

/**
 * 系统配置文件工具类
 */
public class SysConfigUtils {
    //private static final Logger logger = Logger.getLogger(SysConfigUtils.class);

    /**
     * 获取sysConfig.propertites 资源文件对象
     * @return
     */
    private static Properties getProperties()  {
      return   PropertiesUtils.getProperties("sysConfig.properties");
    }

    /**
     * 通过配置文件名称读取配置文件
     * @param name
     * @return
     */
    public static  String getConfigByName(String name){
       return getProperties().getProperty(name);
    }

    /**
     * 图片基础路径
     * @return
     */
    public static  String getImgBaseUrl(){
        return getConfigByName("imgBaseUrl");
    }

    /**
     *传输数据是否加密
     * @return  Y 需要加密，N 不需要加密
     */
    public static  boolean dataIsEncrypt(){
       String isEncrypt=getConfigByName("dataIsEncrypt");
        if("N".equalsIgnoreCase(isEncrypt)){
            return  false;
        }
        return true;
    }
}
