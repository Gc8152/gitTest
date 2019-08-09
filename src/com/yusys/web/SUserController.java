package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yusys.Utils.ResponseUtils;
import com.yusys.entity.SUser;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.service.SUserService.ISUserService;

/**
 * 控制用户跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SUser")
public class SUserController  extends BaseController {
	//private static final Logger logger = Logger.getLogger(SUserController.class); 
	
	@Resource
	private ISUserService suserService;

	/**
	 * 查询所有用户信息
	 */
	@RequestMapping("/queryalluser")
	public void queryAllUser(HttpServletRequest req,HttpServletResponse res){
		try{
		writeUTFJson(res,JsonUtils.beanToJsonp(req,suserService.queryAllUser(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 创建用户信息
	 */
	@RequestMapping("/insertnewuser")
	public void insertNewUser(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.insertNewUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 查询用户详细信息
	 */
	@RequestMapping("/queryoneuser")
	public void queryOneUser(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.queryOneUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}

/**
	 * 查询登录名
	 */
	
/*	@RequestMapping("/queryloginname")
	public void queryLoginName(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.queryLoginName(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}*/
	
	/**
	 * 修改用户信息
	 */
	@RequestMapping("/updateuser")
	public void updateUser(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.updateUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 删除用户信息
	 */
	@RequestMapping("/delteuser")
	public void delteUser(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.delteUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 查询用户密码
	 */
	@RequestMapping("/finduserpass")
	public void findUserPass(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.findUserPass(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 修改用户密码
	 */
	@RequestMapping("/updatepass")
	public void updatePass(HttpServletRequest req,HttpServletResponse res){
		try{
			String old_pwd=req.getParameter("old_pwd");//原密码
			if(old_pwd!=null&&old_pwd.trim().length()>0){
				writeUTFJson(res,JsonUtils.beanToJson(suserService.updatePass(req,getUserId(req))));
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 重置用户密码
	 */
	@RequestMapping("/resetPassWord")
	public void resetPassWord(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.updatePass(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 初始化所有用户密码信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/resetAllUserPass")
	public void resetAllUserPass(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.resetAllUserPass(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 防止乱码方法
	 * @param res
	 * @param json
	 */
	public void writeUTFJson(HttpServletResponse res,String json){
		PrintWriter writer=null;
		try {
			res.setCharacterEncoding("UTF-8"); 
			writer=res.getWriter();
			writer.write(json);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if (writer!=null) {
				writer.flush();
			}
		}
	}
	

 
	
	
	/**
	 * @author  罗一飞
     * POP框查询所有用户
	 * @param
	 */
	@RequestMapping("/popFindAllUser")
	public void findAllSDic(HttpServletRequest req,HttpServletResponse res)	{
		writeUTFJson(res,JsonUtils.beanToJsonp(req,suserService.popFindAllUser(req,getUserId(req))));
	}
    /**
     * 查询用户详细信息
     */
    @RequestMapping("/queryOneUserCache")
    public void queryOneUserCache(HttpServletRequest req,HttpServletResponse res){
        try{
            String user_no=req.getParameter("user_no");
            SUser sUser= suserService.querySUserByNoCache(user_no);
            String userInfo= JsonUtils.beanToJson(sUser);
            ResponseUtils.jsonMessage(res,userInfo);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    /**
     * 查询用户详细信息
     */
    @RequestMapping("/insertUserCache")
    public void insertUserCache(HttpServletRequest req,HttpServletResponse res){
        try{
            String user_no=req.getParameter("user_no");
            suserService.addUserByCache(user_no);
            ResponseUtils.jsonMessage(res, ResponseUtils.jsonSuccess("success!"));
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    /**
     * 查询用户管理字典项的权限
     */
    @RequestMapping("/queryDicPerm")
    public void queryDicPerm(HttpServletRequest req,HttpServletResponse res){
    	writeUTFJson(res,JsonUtils.beanToJson(suserService.queryDicPerm(getUserId(req))));
    }
    /**
     * 
     * 
     * @param @param req
     * @param @param res
     * @return void 
     * @throws 
     *
     */
    @RequestMapping("/updateSkinType")
    public void updateSkinType(HttpServletRequest req,HttpServletResponse res){
    	try{
			writeUTFJson(res,JsonUtils.beanToJson(suserService.updateSkinType(req)));
		}catch(Exception e){
			e.printStackTrace();
		}
    }
    //查询一个用户的所有角色
    @RequestMapping("/queryAllRoleByUser")
    public void queryAllRoleByUser(HttpServletRequest req,HttpServletResponse res){
    	try{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,suserService.queryAllRoleByUser(req)));
		}catch(Exception e){
			e.printStackTrace();
		}
    }
    //维护个人信息
    @RequestMapping("/maintain")
    public void maintain(HttpServletRequest req,HttpServletResponse res){
    	try{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,suserService.maintain(req)));
		}catch(Exception e){
			e.printStackTrace();
		}
    }
    
    //添加人员
	@RequestMapping("/popFindUser")
	public void popFindUser(HttpServletRequest req,HttpServletResponse res)	{
		writeUTFJson(res,JsonUtils.beanToJsonp(req,suserService.popFindUser(req,getUserId(req))));
	}
    
}
