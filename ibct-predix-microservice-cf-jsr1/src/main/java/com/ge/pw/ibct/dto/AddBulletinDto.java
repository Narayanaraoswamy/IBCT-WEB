/**
 * Required to get data from UI to add a bulletin
 */
package com.ge.pw.ibct.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

//import com.ge.pw.ibct.dto.AddBulletinDto.Serials;

/**
 * @author MV355484
 *
 */
public class AddBulletinDto extends Bulletindto {

	private String category;
	
	private String complianceLevel;
	private Integer[] timings;
	private String[] fromserials;
	private String[] toserials;
	@JsonFormat(pattern = "MM/dd/yyyy", timezone = "CET")
	private Date revisionDate;
	private String trackImplimentationPlan;
	private String significant;
	private String voucherProgram;
	private String fieldImplementationMetric;
	private String remarks;
	
	private String productLine;
	private String description;
	private String revision;
	private Boolean newRevision;
	
	public Boolean getNewRevision() {
		return newRevision;
	}
	public void setNewRevision(Boolean newRevision) {
		this.newRevision = newRevision;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getComplianceLevel() {
		return complianceLevel;
	}
	public void setComplianceLevel(String complianceLevel) {
		this.complianceLevel = complianceLevel;
	}

	
	public Integer[] getTimings() {
		return timings;
	}
	public void setTimings(Integer[] timings) {
		this.timings = timings;
	}
	public String[] getFromserials() {
		return fromserials;
	}
	public void setFromserials(String[] fromserials) {
		this.fromserials = fromserials;
	}
	public String[] getToserials() {
		return toserials;
	}
	public void setToserials(String[] toserials) {
		this.toserials = toserials;
	}
	public Date getRevisionDate() {
		return revisionDate;
	}
	public void setRevisionDate(Date revisionDate) {
		this.revisionDate = revisionDate;
	}
	public String getTrackImplimentationPlan() {
		return trackImplimentationPlan;
	}
	public void setTrackImplimentationPlan(String trackImplimentationPlan) {
		this.trackImplimentationPlan = trackImplimentationPlan;
	}
	public String getSignificant() {
		return significant;
	}
	public void setSignificant(String significant) {
		this.significant = significant;
	}
	public String getVoucherProgram() {
		return voucherProgram;
	}
	public void setVoucherProgram(String voucherProgram) {
		this.voucherProgram = voucherProgram;
	}
	public String getFieldImplementationMetric() {
		return fieldImplementationMetric;
	}
	public void setFieldImplementationMetric(String fieldImplementationMetric) {
		this.fieldImplementationMetric = fieldImplementationMetric;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getProductLine() {
		return productLine;
	}
	public void setProductLine(String productLine) {
		this.productLine = productLine;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getRevision() {
		return revision;
	}
	public void setRevision(String revision) {
		this.revision = revision;
	}
	
	
	
}


