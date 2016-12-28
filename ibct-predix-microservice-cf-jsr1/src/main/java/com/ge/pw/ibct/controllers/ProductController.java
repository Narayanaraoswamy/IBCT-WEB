package com.ge.pw.ibct.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.bind.annotation.;


import com.ge.pw.ibct.services.ProductService;
import com.ge.pw.ibct.utils.CommonUtil;
import com.ge.pw.ibct.utils.WSResponseStatus;

@RestController
@RequestMapping("/ibct")
public class ProductController{
	@Autowired
	ProductService productService;
	
	@RequestMapping("/Product")
	@CrossOrigin
	public @ResponseBody WSResponseStatus getProductLines(){
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		try{
			wsResponseStatus.setData(productService.getProductLine());
			return wsResponseStatus;
		}
		catch(Exception ex){
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
		
	}
	
}