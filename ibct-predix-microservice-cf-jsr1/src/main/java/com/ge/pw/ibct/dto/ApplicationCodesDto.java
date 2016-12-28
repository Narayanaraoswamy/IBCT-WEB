package com.ge.pw.ibct.dto;

import java.util.ArrayList;
import java.util.List;

import com.ge.pw.ibct.entity.ComtApplicationCodeEntity;

public class ApplicationCodesDto{
	private long codeID;
	private String applicationID;
	private String codeType;
	private String codeName;
	private String codeDescription;
	private String codeFlag;
	public long getCodeID() {
		return codeID;
	}
	public void setCodeID(long codeID) {
		this.codeID = codeID;
	}
	public String getApplicationID() {
		return applicationID;
	}
	public void setApplicationID(String applicationID) {
		this.applicationID = applicationID;
	}
	public String getCodeType() {
		return codeType;
	}
	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}
	public String getCodeName() {
		return codeName;
	}
	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}
	public String getCodeDescription() {
		return codeDescription;
	}
	public void setCodeDescription(String codeDescription) {
		this.codeDescription = codeDescription;
	}
	public String getCodeFlag() {
		return codeFlag;
	}
	public void setCodeFlag(String codeFlag) {
		this.codeFlag = codeFlag;
	}
	
	public List<ApplicationCodesDto> getTimingCodesFromEntity(List<ComtApplicationCodeEntity> code){
		List<ApplicationCodesDto> lstTimingDto = new ArrayList<ApplicationCodesDto>();
		ApplicationCodesDto objApplicationCodesDto;
		for (ComtApplicationCodeEntity comtApplicationCodeEntity : code) {
			objApplicationCodesDto = new ApplicationCodesDto();
			objApplicationCodesDto.codeID = comtApplicationCodeEntity.getCodeId();
			objApplicationCodesDto.codeDescription = comtApplicationCodeEntity.getCodeDescription();
			objApplicationCodesDto.codeName = comtApplicationCodeEntity.getCodeName();
			lstTimingDto.add(objApplicationCodesDto);
		}
		return lstTimingDto;
		
	}
}