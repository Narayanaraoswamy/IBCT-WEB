/*
 * Created on 8 Dec 2016 ( Time 20:22:44 )
 * Generated by Telosys Tools Generator ( version 2.1.1 )
 */
package com.ge.pw.ibct.entity;
import java.io.Serializable;

import javax.persistence.*;

/**
 * Composite primary key for entity "CcttBulletinProductEntity" ( stored in table "cctt_bulletin_product" )
 *
 * @author Telosys Tools Generator
 *
 */
 @Embeddable
public class CcttBulletinProductEntityKey implements Serializable {

    private static final long serialVersionUID = 1L;

    //----------------------------------------------------------------------
    // ENTITY KEY ATTRIBUTES 
    //----------------------------------------------------------------------
    @Column(name="from_serial_num", nullable=false, length=20)
    private String     fromSerialNum ;
    
    @Column(name="rev_id", nullable=false)
    private Integer    revId        ;
    
    @Column(name="bulletin_num", nullable=false, length=50)
    private String     bulletinNum  ;
    
    @Column(name="timing_code", nullable=false)
    private Integer    timingCode   ;
    

    //----------------------------------------------------------------------
    // CONSTRUCTORS
    //----------------------------------------------------------------------
    public CcttBulletinProductEntityKey() {
        super();
    }

    public CcttBulletinProductEntityKey( String fromSerialNum, Integer revId, String bulletinNum, Integer timingCode ) {
        super();
        this.fromSerialNum = fromSerialNum ;
        this.revId = revId ;
        this.bulletinNum = bulletinNum ;
        this.timingCode = timingCode ;
    }
    
    //----------------------------------------------------------------------
    // GETTERS & SETTERS FOR KEY FIELDS
    //----------------------------------------------------------------------
    public void setFromSerialNum( String value ) {
        this.fromSerialNum = value;
    }
    public String getFromSerialNum() {
        return this.fromSerialNum;
    }

    public void setRevId( Integer value ) {
        this.revId = value;
    }
    public Integer getRevId() {
        return this.revId;
    }

    public void setBulletinNum( String value ) {
        this.bulletinNum = value;
    }
    public String getBulletinNum() {
        return this.bulletinNum;
    }

    public void setTimingCode( Integer value ) {
        this.timingCode = value;
    }
    public Integer getTimingCode() {
        return this.timingCode;
    }


    //----------------------------------------------------------------------
    // equals METHOD
    //----------------------------------------------------------------------
	public boolean equals(Object obj) { 
		if ( this == obj ) return true ; 
		if ( obj == null ) return false ;
		if ( this.getClass() != obj.getClass() ) return false ; 
		CcttBulletinProductEntityKey other = (CcttBulletinProductEntityKey) obj; 
		//--- Attribute fromSerialNum
		if ( fromSerialNum == null ) { 
			if ( other.fromSerialNum != null ) 
				return false ; 
		} else if ( ! fromSerialNum.equals(other.fromSerialNum) ) 
			return false ; 
		//--- Attribute revId
		if ( revId == null ) { 
			if ( other.revId != null ) 
				return false ; 
		} else if ( ! revId.equals(other.revId) ) 
			return false ; 
		//--- Attribute bulletinNum
		if ( bulletinNum == null ) { 
			if ( other.bulletinNum != null ) 
				return false ; 
		} else if ( ! bulletinNum.equals(other.bulletinNum) ) 
			return false ; 
		//--- Attribute timingCode
		if ( timingCode == null ) { 
			if ( other.timingCode != null ) 
				return false ; 
		} else if ( ! timingCode.equals(other.timingCode) ) 
			return false ; 
		return true; 
	} 


    //----------------------------------------------------------------------
    // hashCode METHOD
    //----------------------------------------------------------------------
	public int hashCode() { 
		final int prime = 31; 
		int result = 1; 
		
		//--- Attribute fromSerialNum
		result = prime * result + ((fromSerialNum == null) ? 0 : fromSerialNum.hashCode() ) ; 
		//--- Attribute revId
		result = prime * result + ((revId == null) ? 0 : revId.hashCode() ) ; 
		//--- Attribute bulletinNum
		result = prime * result + ((bulletinNum == null) ? 0 : bulletinNum.hashCode() ) ; 
		//--- Attribute timingCode
		result = prime * result + ((timingCode == null) ? 0 : timingCode.hashCode() ) ; 
		
		return result; 
	} 


    //----------------------------------------------------------------------
    // toString METHOD
    //----------------------------------------------------------------------
    public String toString() {
		StringBuffer sb = new StringBuffer(); 
		sb.append(fromSerialNum); 
		sb.append("|"); 
		sb.append(revId); 
		sb.append("|"); 
		sb.append(bulletinNum); 
		sb.append("|"); 
		sb.append(timingCode); 
        return sb.toString();
    }
}
