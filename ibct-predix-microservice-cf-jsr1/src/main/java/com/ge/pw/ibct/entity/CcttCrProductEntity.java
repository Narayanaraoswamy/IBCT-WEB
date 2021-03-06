/*
 * Created on 25 Nov 2016 ( Time 21:24:46 )
 * Generated by Telosys Tools Generator ( version 2.1.1 )
 */
// This Bean has a basic Primary Key (not composite) 

package com.ge.pw.ibct.entity;

import java.io.Serializable;

//import javax.validation.constraints.* ;
//import org.hibernate.validator.constraints.* ;

import java.util.Date;

import javax.persistence.*;

/**
 * Persistent class for entity stored in table "cctt_cr_product"
 *
 * @author Telosys Tools Generator
 *
 */

@Entity
@Table(name="cctt_cr_product", schema="cct" )
// Define named queries here
@NamedQueries ( {
  @NamedQuery ( name="CcttCrProductEntity.countAll", query="SELECT COUNT(x) FROM CcttCrProductEntity x" )
} )
public class CcttCrProductEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    //----------------------------------------------------------------------
    // ENTITY PRIMARY KEY ( BASED ON A SINGLE FIELD )
    //----------------------------------------------------------------------
    @Id
    @Column(name="product_id", nullable=false)
    private Integer    productId    ;


    //----------------------------------------------------------------------
    // ENTITY DATA FIELDS 
    //----------------------------------------------------------------------    
    @Column(name="product_serial_num", nullable=false, length=20)
    private String     productSerialNum ;

    @Column(name="product_type", length=10)
    private String     productType  ;

    @Column(name="locked_ind", nullable=false, length=1)
    private String     lockedInd    ;

    @Column(name="created_by", nullable=false, length=20)
    private String     createdBy    ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="created_date", nullable=false)
    private Date       createdDate  ;

    @Column(name="last_updated_by", nullable=false, length=20)
    private String     lastUpdatedBy ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="last_updated_date", nullable=false)
    private Date       lastUpdatedDate ;

    @Column(name="iad_pdm_geps_id")
    private Integer    iadPdmGepsId ;

    @Column(name="csm_geps_id")
    private Integer    csmGepsId    ;

    @Column(name="operating_status", nullable=false, length=10)
    private String     operatingStatus ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="ship_date", nullable=false)
    private Date       shipDate     ;

    @Column(name="site_duns", length=50)
    private String     siteDuns     ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="first_fire_date")
    private Date       firstFireDate ;

    @Column(name="region_code")
    private Integer    regionCode   ;

    @Column(name="regional_fsm_geps_id")
    private Integer    regionalFsmGepsId ;

    @Column(name="csa_ind", length=1)
    private String     csaInd       ;

    @Column(name="cpm_geps_id")
    private Integer    cpmGepsId    ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="cod")
    private Date       cod          ;

    @Column(name="lease_pool_contract_ind", length=1)
    private String     leasePoolContractInd ;

    @Column(name="unit_num", length=50)
    private String     unitNum      ;

    @Column(name="product_owner", length=10)
    private String     productOwner ;

    @Column(name="locked_order_id", length=18)
    private String     lockedOrderId ;

    @Column(name="extnl_package_ref_num", length=10)
    private String     extnlPackageRefNum ;

    @Column(name="orap_participant_ind", length=1)
    private String     orapParticipantInd ;

    @Column(name="driven_equip_code")
    private Integer    drivenEquipCode ;

    @Column(name="default_op_hours")
    private Integer    defaultOpHours ;

    @Column(name="default_op_hours_uom_code")
    private Integer    defaultOpHoursUomCode ;

    @Column(name="default_op_cycle_cnt")
    private Integer    defaultOpCycleCnt ;

    @Column(name="remote_monitored_ind", length=1)
    private String     remoteMonitoredInd ;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="last_inprocess_date")
    private Date       lastInprocessDate ;

    @Column(name="primary_fuel_code", length=30)
    private String     primaryFuelCode ;

    @Column(name="product_line", length=30)
    private String     productLine ;
	// "productLine" (column "product_line") is not defined by itself because used as FK in a link 


    //----------------------------------------------------------------------
    // ENTITY LINKS ( RELATIONSHIP )
    //----------------------------------------------------------------------
    /*@ManyToOne
    @JoinColumn(name="product_line", referencedColumnName="product_line")
    private CcttProductLineEntity ccttProductLine;
*/

    //----------------------------------------------------------------------
    // CONSTRUCTOR(S)
    //----------------------------------------------------------------------
    public CcttCrProductEntity() {
		super();
    }
    
    //----------------------------------------------------------------------
    // GETTER & SETTER FOR THE KEY FIELD
    //----------------------------------------------------------------------
    public void setProductId( Integer productId ) {
        this.productId = productId ;
    }
    public Integer getProductId() {
        return this.productId;
    }

    //----------------------------------------------------------------------
    // GETTERS & SETTERS FOR FIELDS
    //----------------------------------------------------------------------
    //--- DATABASE MAPPING : product_serial_num ( varchar ) 
    public void setProductSerialNum( String productSerialNum ) {
        this.productSerialNum = productSerialNum;
    }
    public String getProductSerialNum() {
        return this.productSerialNum;
    }

    //--- DATABASE MAPPING : product_type ( varchar ) 
    public void setProductType( String productType ) {
        this.productType = productType;
    }
    public String getProductType() {
        return this.productType;
    }

    //--- DATABASE MAPPING : locked_ind ( bpchar ) 
    public void setLockedInd( String lockedInd ) {
        this.lockedInd = lockedInd;
    }
    public String getLockedInd() {
        return this.lockedInd;
    }

    //--- DATABASE MAPPING : created_by ( varchar ) 
    public void setCreatedBy( String createdBy ) {
        this.createdBy = createdBy;
    }
    public String getCreatedBy() {
        return this.createdBy;
    }

    //--- DATABASE MAPPING : created_date ( timestamp ) 
    public void setCreatedDate( Date createdDate ) {
        this.createdDate = createdDate;
    }
    public Date getCreatedDate() {
        return this.createdDate;
    }

    //--- DATABASE MAPPING : last_updated_by ( varchar ) 
    public void setLastUpdatedBy( String lastUpdatedBy ) {
        this.lastUpdatedBy = lastUpdatedBy;
    }
    public String getLastUpdatedBy() {
        return this.lastUpdatedBy;
    }

    //--- DATABASE MAPPING : last_updated_date ( timestamp ) 
    public void setLastUpdatedDate( Date lastUpdatedDate ) {
        this.lastUpdatedDate = lastUpdatedDate;
    }
    public Date getLastUpdatedDate() {
        return this.lastUpdatedDate;
    }

    //--- DATABASE MAPPING : iad_pdm_geps_id ( int4 ) 
    public void setIadPdmGepsId( Integer iadPdmGepsId ) {
        this.iadPdmGepsId = iadPdmGepsId;
    }
    public Integer getIadPdmGepsId() {
        return this.iadPdmGepsId;
    }

    //--- DATABASE MAPPING : csm_geps_id ( int4 ) 
    public void setCsmGepsId( Integer csmGepsId ) {
        this.csmGepsId = csmGepsId;
    }
    public Integer getCsmGepsId() {
        return this.csmGepsId;
    }

    //--- DATABASE MAPPING : operating_status ( varchar ) 
    public void setOperatingStatus( String operatingStatus ) {
        this.operatingStatus = operatingStatus;
    }
    public String getOperatingStatus() {
        return this.operatingStatus;
    }

    //--- DATABASE MAPPING : ship_date ( timestamp ) 
    public void setShipDate( Date shipDate ) {
        this.shipDate = shipDate;
    }
    public Date getShipDate() {
        return this.shipDate;
    }

    //--- DATABASE MAPPING : site_duns ( varchar ) 
    public void setSiteDuns( String siteDuns ) {
        this.siteDuns = siteDuns;
    }
    public String getSiteDuns() {
        return this.siteDuns;
    }

    //--- DATABASE MAPPING : first_fire_date ( timestamp ) 
    public void setFirstFireDate( Date firstFireDate ) {
        this.firstFireDate = firstFireDate;
    }
    public Date getFirstFireDate() {
        return this.firstFireDate;
    }

    //--- DATABASE MAPPING : region_code ( int4 ) 
    public void setRegionCode( Integer regionCode ) {
        this.regionCode = regionCode;
    }
    public Integer getRegionCode() {
        return this.regionCode;
    }

    //--- DATABASE MAPPING : regional_fsm_geps_id ( int4 ) 
    public void setRegionalFsmGepsId( Integer regionalFsmGepsId ) {
        this.regionalFsmGepsId = regionalFsmGepsId;
    }
    public Integer getRegionalFsmGepsId() {
        return this.regionalFsmGepsId;
    }

    //--- DATABASE MAPPING : csa_ind ( bpchar ) 
    public void setCsaInd( String csaInd ) {
        this.csaInd = csaInd;
    }
    public String getCsaInd() {
        return this.csaInd;
    }

    //--- DATABASE MAPPING : cpm_geps_id ( int4 ) 
    public void setCpmGepsId( Integer cpmGepsId ) {
        this.cpmGepsId = cpmGepsId;
    }
    public Integer getCpmGepsId() {
        return this.cpmGepsId;
    }

    //--- DATABASE MAPPING : cod ( timestamp ) 
    public void setCod( Date cod ) {
        this.cod = cod;
    }
    public Date getCod() {
        return this.cod;
    }

    //--- DATABASE MAPPING : lease_pool_contract_ind ( bpchar ) 
    public void setLeasePoolContractInd( String leasePoolContractInd ) {
        this.leasePoolContractInd = leasePoolContractInd;
    }
    public String getLeasePoolContractInd() {
        return this.leasePoolContractInd;
    }

    //--- DATABASE MAPPING : unit_num ( varchar ) 
    public void setUnitNum( String unitNum ) {
        this.unitNum = unitNum;
    }
    public String getUnitNum() {
        return this.unitNum;
    }

    //--- DATABASE MAPPING : product_owner ( varchar ) 
    public void setProductOwner( String productOwner ) {
        this.productOwner = productOwner;
    }
    public String getProductOwner() {
        return this.productOwner;
    }

    //--- DATABASE MAPPING : locked_order_id ( varchar ) 
    public void setLockedOrderId( String lockedOrderId ) {
        this.lockedOrderId = lockedOrderId;
    }
    public String getLockedOrderId() {
        return this.lockedOrderId;
    }

    //--- DATABASE MAPPING : extnl_package_ref_num ( varchar ) 
    public void setExtnlPackageRefNum( String extnlPackageRefNum ) {
        this.extnlPackageRefNum = extnlPackageRefNum;
    }
    public String getExtnlPackageRefNum() {
        return this.extnlPackageRefNum;
    }

    //--- DATABASE MAPPING : orap_participant_ind ( bpchar ) 
    public void setOrapParticipantInd( String orapParticipantInd ) {
        this.orapParticipantInd = orapParticipantInd;
    }
    public String getOrapParticipantInd() {
        return this.orapParticipantInd;
    }

    //--- DATABASE MAPPING : driven_equip_code ( int4 ) 
    public void setDrivenEquipCode( Integer drivenEquipCode ) {
        this.drivenEquipCode = drivenEquipCode;
    }
    public Integer getDrivenEquipCode() {
        return this.drivenEquipCode;
    }

    //--- DATABASE MAPPING : default_op_hours ( int4 ) 
    public void setDefaultOpHours( Integer defaultOpHours ) {
        this.defaultOpHours = defaultOpHours;
    }
    public Integer getDefaultOpHours() {
        return this.defaultOpHours;
    }

    //--- DATABASE MAPPING : default_op_hours_uom_code ( int4 ) 
    public void setDefaultOpHoursUomCode( Integer defaultOpHoursUomCode ) {
        this.defaultOpHoursUomCode = defaultOpHoursUomCode;
    }
    public Integer getDefaultOpHoursUomCode() {
        return this.defaultOpHoursUomCode;
    }

    //--- DATABASE MAPPING : default_op_cycle_cnt ( int4 ) 
    public void setDefaultOpCycleCnt( Integer defaultOpCycleCnt ) {
        this.defaultOpCycleCnt = defaultOpCycleCnt;
    }
    public Integer getDefaultOpCycleCnt() {
        return this.defaultOpCycleCnt;
    }

    //--- DATABASE MAPPING : remote_monitored_ind ( bpchar ) 
    public void setRemoteMonitoredInd( String remoteMonitoredInd ) {
        this.remoteMonitoredInd = remoteMonitoredInd;
    }
    public String getRemoteMonitoredInd() {
        return this.remoteMonitoredInd;
    }

    //--- DATABASE MAPPING : last_inprocess_date ( timestamp ) 
    public void setLastInprocessDate( Date lastInprocessDate ) {
        this.lastInprocessDate = lastInprocessDate;
    }
    public Date getLastInprocessDate() {
        return this.lastInprocessDate;
    }

    //--- DATABASE MAPPING : primary_fuel_code ( varchar ) 
    public void setPrimaryFuelCode( String primaryFuelCode ) {
        this.primaryFuelCode = primaryFuelCode;
    }
    public String getPrimaryFuelCode() {
        return this.primaryFuelCode;
    }


    //----------------------------------------------------------------------
    // GETTERS & SETTERS FOR LINKS
    //----------------------------------------------------------------------
    /*public void setCcttProductLine( CcttProductLineEntity ccttProductLine ) {
        this.ccttProductLine = ccttProductLine;
    }
    public CcttProductLineEntity getCcttProductLine() {
        return this.ccttProductLine;
    }
*/
    public void setProductLine( String productLine ) {
        this.productLine = productLine;
    }
    public String getProductLine() {
        return this.productLine;
    }
    
    //----------------------------------------------------------------------
    // toString METHOD
    //----------------------------------------------------------------------
    public String toString() { 
        StringBuffer sb = new StringBuffer(); 
        sb.append("["); 
        sb.append(productId);
        sb.append("]:"); 
        sb.append(productSerialNum);
        sb.append("|");
        sb.append(productType);
        sb.append("|");
        sb.append(lockedInd);
        sb.append("|");
        sb.append(createdBy);
        sb.append("|");
        sb.append(createdDate);
        sb.append("|");
        sb.append(lastUpdatedBy);
        sb.append("|");
        sb.append(lastUpdatedDate);
        sb.append("|");
        sb.append(iadPdmGepsId);
        sb.append("|");
        sb.append(csmGepsId);
        sb.append("|");
        sb.append(operatingStatus);
        sb.append("|");
        sb.append(shipDate);
        sb.append("|");
        sb.append(siteDuns);
        sb.append("|");
        sb.append(firstFireDate);
        sb.append("|");
        sb.append(regionCode);
        sb.append("|");
        sb.append(regionalFsmGepsId);
        sb.append("|");
        sb.append(csaInd);
        sb.append("|");
        sb.append(cpmGepsId);
        sb.append("|");
        sb.append(cod);
        sb.append("|");
        sb.append(leasePoolContractInd);
        sb.append("|");
        sb.append(unitNum);
        sb.append("|");
        sb.append(productOwner);
        sb.append("|");
        sb.append(lockedOrderId);
        sb.append("|");
        sb.append(extnlPackageRefNum);
        sb.append("|");
        sb.append(orapParticipantInd);
        sb.append("|");
        sb.append(drivenEquipCode);
        sb.append("|");
        sb.append(defaultOpHours);
        sb.append("|");
        sb.append(defaultOpHoursUomCode);
        sb.append("|");
        sb.append(defaultOpCycleCnt);
        sb.append("|");
        sb.append(remoteMonitoredInd);
        sb.append("|");
        sb.append(lastInprocessDate);
        sb.append("|");
        sb.append(primaryFuelCode);
        return sb.toString(); 
    } 

}
