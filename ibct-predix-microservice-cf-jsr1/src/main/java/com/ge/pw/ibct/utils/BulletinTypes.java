package com.ge.pw.ibct.utils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.springframework.beans.factory.annotation.Value;

@Entity
@Table(name="cctt_bulletin", schema="cct" )
// Define named queries here
@NamedQueries ( {
  @NamedQuery ( name="BulletinTypes.countAll", query="SELECT COUNT(x) FROM BulletinTypes x" )
} )
public class BulletinTypes implements Serializable {

    private static final long serialVersionUID = 1L;

    //----------------------------------------------------------------------
    // ENTITY PRIMARY KEY ( BASED ON A SINGLE FIELD )
    //----------------------------------------------------------------------
    @Id
    @Column(name="bulletin_num", nullable=false, length=50)
    private String     bulletinNum  ;
    
    public void setBulletinNum( String bulletinNum ) {
        this.bulletinNum = bulletinNum ;
    }
    public String getBulletinNum() {
        return this.bulletinNum;
    }

}