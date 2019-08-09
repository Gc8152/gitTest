package com.yusys.global.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.yusys.Utils.DES;
import com.yusys.Utils.SysConfigUtils;

/**
 * Created with IntelliJ IDEA.
 * User: wuxw
 * Date: 15-11-2
 * Time: 下午2:30
 * To change this template use File | Settings | File Templates.
 */
public class CommonRequestContextDesryptFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        servletRequest.setCharacterEncoding("utf-8");
        String requestJosn=servletRequest.getParameter("json");  //拦截获取json
        String key=servletRequest.getParameter("YX_SID");
        String actorno=key;
        try {// 拦截获取 解密key
            if (StringUtils.isBlank(key)) {
                key = DES.LOGIN_DEKEY;// 暂时写死，可以配置化。
            } else {
                if (SysConfigUtils.dataIsEncrypt()) {
                    actorno= DES.decrypt(key, DES.LOGIN_ENKEY); // 请求人工号
                }
            }
            if (SysConfigUtils.dataIsEncrypt()) {  // 配置是加密的，则需要解密
                requestJosn = DES.decrypt(requestJosn, key);  // 解密json串
            }
            servletRequest.setAttribute("json", requestJosn);//将结果设置 到json对象
            servletRequest.setAttribute("actorno", actorno); // 请求人工号
        } catch (Exception e) {
            e.printStackTrace();
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
    }
}
