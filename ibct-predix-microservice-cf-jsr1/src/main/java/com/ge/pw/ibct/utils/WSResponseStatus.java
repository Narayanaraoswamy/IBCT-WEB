package com.ge.pw.ibct.utils;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WSResponseStatus implements Serializable{
	
	private static final long serialVersionUID = 1L;

	public WSResponseStatus(){
		
	}
	
	private String statusCode;
	private String statusMessage;
	
	private String errorCode;
	private String errorMsg;
	private String defaultErrMsg;
	private Map<String,Object> dataMap = new HashMap<String,Object>();
	private Map<String,List<String>> errorDescMap = new HashMap<String,List<String>>();
	private Object data;
			
	public Map<String, List<String>> getErrorDescMap() {
		return errorDescMap;
	}
	public void setErrorDescMap(Map<String, List<String>> errorDescMap) {
		this.errorDescMap = errorDescMap;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public String getStatusMessage() {
		return statusMessage;
	}
	public void setStatusMessage(String statusMessage) {
		this.statusMessage = statusMessage;
	}
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorMsg() {
		return errorMsg;
	}
	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	public String getDefaultErrMsg() {
		return defaultErrMsg;
	}
	public void setDefaultErrMsg(String defaultErrMsg) {
		this.defaultErrMsg = defaultErrMsg;
	}
	public Map<String, Object> getDataMap() {
		return dataMap;
	}
	public void setDataMap(Map<String, Object> data) {
		this.dataMap = data;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
}
