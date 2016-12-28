package com.ge.pw.ibct.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ge.pw.ibct.beans.CcttBulletin;
import com.ge.pw.ibct.entity.CcttBulletinEntity;


public class Bulletindto{
	private String     bulletinNum  ;
	private Integer    bulletinTypeCode ;
	
	@JsonFormat(pattern = "MM/dd/yyyy", timezone = "CET")
	private Date       issueDate    ;
	private String     bulletinStatus ;
	private String     supercededBulletinNum ;
	private Integer    latestRevId  ;
	private String     createdBy    ;
	
	@JsonFormat(pattern = "MM/dd/yyyy", timezone = "CET")
	private Date       createdDate  ;
	private String     lastUpdatedBy ;
	
	@JsonFormat(pattern = "MM/dd/yyyy", timezone = "CET")
	private Date       lastUpdatedDate ;
	
	public Bulletindto()
	{
	
	}
	
	
	public Bulletindto(String bulletinNum,Integer bulletinTypeCode,Date issueDate,String bulletinStatus,String supercededBulletinNum,
			Integer latestRevId,String createdBy,Date createdDate,String lastUpdatedBy,Date lastUpdatedDate){
		this.bulletinNum = bulletinNum;
		this.bulletinStatus = bulletinStatus;
		this.bulletinTypeCode = bulletinTypeCode;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.issueDate = issueDate;
		this.lastUpdatedBy = lastUpdatedBy;
		this.lastUpdatedDate = lastUpdatedDate;
		this.latestRevId = latestRevId;
		this.supercededBulletinNum = supercededBulletinNum;
	}
	
	
	
	public Bulletindto getBulletindtofromEntity(CcttBulletin ccttBulletin){
		return new Bulletindto( ccttBulletin.getBulletinNum(),
				ccttBulletin.getBulletinTypeCode(),
				ccttBulletin.getIssueDate(),
				ccttBulletin.getBulletinStatus(),
				ccttBulletin.getSupercededBulletinNum(),
				ccttBulletin.getLatestRevId(),
				ccttBulletin.getCreatedBy(),
				ccttBulletin.getCreatedDate(),
				ccttBulletin.getLastUpdatedBy(),
				ccttBulletin.getLastUpdatedDate());
		
	}
	
	
	public void setBulletinNum( String bulletinNum ) {
        this.bulletinNum = bulletinNum ;
    }
    public String getBulletinNum() {
        return this.bulletinNum;
    }
    
    public void setBulletinTypeCode( Integer bulletinTypeCode ) {
        this.bulletinTypeCode = bulletinTypeCode;
    }
    public Integer getBulletinTypeCode() {
        return this.bulletinTypeCode;
    }
    
    public void setIssueDate( Date issueDate ) {
        this.issueDate = issueDate;
    }
    public Date getIssueDate() {
        return this.issueDate;
    }
    
    public void setBulletinStatus( String bulletinStatus ) {
        this.bulletinStatus = bulletinStatus;
    }
    public String getBulletinStatus() {
        return this.bulletinStatus;
    }
    
    public void setSupercededBulletinNum( String supercededBulletinNum ) {
        this.supercededBulletinNum = supercededBulletinNum;
    }
    public String getSupercededBulletinNum() {
        return this.supercededBulletinNum;
    }
    
    public void setLatestRevId( Integer latestRevId ) {
        this.latestRevId = latestRevId;
    }
    public Integer getLatestRevId() {
        return this.latestRevId;
    }
    
    public void setCreatedBy( String createdBy ) {
        this.createdBy = createdBy;
    }
    public String getCreatedBy() {
        return this.createdBy;
    }
    
    public void setCreatedDate( Date createdDate ) {
        this.createdDate = createdDate;
    }
    public Date getCreatedDate() {
        return this.createdDate;
    }
    
    public void setLastUpdatedBy( String lastUpdatedBy ) {
        this.lastUpdatedBy = lastUpdatedBy;
    }
    public String getLastUpdatedBy() {
        return this.lastUpdatedBy;
    }
    
    public void setLastUpdatedDate( Date lastUpdatedDate ) {
        this.lastUpdatedDate = lastUpdatedDate;
    }
    public Date getLastUpdatedDate() {
        return this.lastUpdatedDate;
    }
    
}