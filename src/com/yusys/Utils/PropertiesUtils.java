package com.yusys.Utils;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: wuxw
 * Date: 15-11-9
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */
public class PropertiesUtils {
    private static final Logger logger = Logger.getLogger(PropertiesUtils.class);
    // 读取任务类型属性文件
    public static Properties getProperties(String fileName)  {

        Properties properties = new Properties();
        InputStream is = Thread.currentThread().getContextClassLoader()
                .getResourceAsStream(fileName);

        try {
            properties.load(is);
        } catch (IOException e) {
            e.printStackTrace();
            logger.error(e);
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return properties;
    }
}
