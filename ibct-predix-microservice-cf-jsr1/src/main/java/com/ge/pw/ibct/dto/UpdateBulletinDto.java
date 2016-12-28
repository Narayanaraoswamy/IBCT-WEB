/**
 * Required to get data from UI to add a bulletin
 */
package com.ge.pw.ibct.dto;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
public class UpdateBulletinDto extends Bulletindto {
private String category;
	
	private String[] fromserials;
	private String[] toserials;
	@JsonFormat(pattern = "MM/dd/yyyy", timezone = "CET")
	private String remarks;
	
	private String productLine;
	private List<RevisionsDto> revisions;
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
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
	public List<RevisionsDto> getRevisions() {
		return revisions;
	}
	public void setRevisions(List<RevisionsDto> revisions) {
		this.revisions = revisions;
	}
	
	
}