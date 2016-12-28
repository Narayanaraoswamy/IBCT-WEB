package com.ge.pw.ibct.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;

import org.apache.hadoop.mapred.gethistory_jsp;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.neo4j.cypher.internal.compiler.v2_1.ast.rewriters.distributeLawsRewriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;

import scala.Console;

import com.ge.pw.ibct.beans.CcttBulletin;
import com.ge.pw.ibct.repository.CcttBulletinJpaRepository;
import com.ge.pw.ibct.repository.CcttBulletinProductJpaRepository;
import com.ge.pw.ibct.repository.CcttBulletinRevisionJpaRepository;
import com.ge.pw.ibct.repository.CcttCrProductJpaRepository;
import com.ge.pw.ibct.repository.CcttProductLineJpaRepository;
import com.ge.pw.ibct.repository.CcttProductTypeJpaRepository;
import com.ge.pw.ibct.repository.ComtApplicationCodeJpaRepository;
import com.ge.pw.ibct.utils.BulletinTypes;
import com.ge.pw.ibct.dto.AddBulletinDto;
import com.ge.pw.ibct.entity.CcttBulletinEntity;
import com.ge.pw.ibct.entity.CcttBulletinProductEntity;
import com.ge.pw.ibct.entity.CcttBulletinProductEntityKey;
import com.ge.pw.ibct.entity.CcttBulletinRevisionEntity;
import com.ge.pw.ibct.entity.CcttBulletinRevisionEntityKey;
import com.ge.pw.ibct.entity.CcttCrProductEntity;
import com.ge.pw.ibct.entity.CcttProductLineEntity;
import com.ge.pw.ibct.entity.CcttProductTypeEntity;
import com.ge.pw.ibct.entity.ComtApplicationCodeEntity;
import com.ge.pw.ibct.exceptions.DatabaseValidationException;

@Service
public class BulletinService {

	@Autowired
	CcttBulletinJpaRepository ccttBulletinJpaRepository;
	@Autowired
	CcttProductLineJpaRepository ccttProductLineJpaRepository;
	@Autowired
	CcttBulletinRevisionJpaRepository ccttBulletinRevisionJpaRepository;
	@Autowired
	CcttBulletinProductJpaRepository ccttBulletinProductJpaRepository;
	@Autowired
	CcttCrProductJpaRepository ccttcrRepository;
	@Autowired
	CcttProductTypeJpaRepository ccttProductTRepository;
	@Autowired
	ComtApplicationCodeJpaRepository codeJpaRepository;

	public CcttBulletinEntity getBulletin(String bulletinNumber) {
		return ccttBulletinJpaRepository.findOne(bulletinNumber);
	}

	public Object cancelBulletin(String bulletinNumber) {
		CcttBulletinEntity bulletin = ccttBulletinJpaRepository
				.findOne(bulletinNumber);
		bulletin.setBulletinStatus("INEFFECTIVE");
		ccttBulletinJpaRepository.save(bulletin);
		return ccttBulletinJpaRepository.findOne(bulletinNumber);
	}

	public List<String> getSupercedValues(Integer bulletinTypeCode,
			String productLine, String bulletinStatus) {
		return ccttBulletinJpaRepository
				.findByBulletinTypeCodeAndProductLineAndBulletinStatus(
						bulletinTypeCode, productLine, bulletinStatus).stream()
				.map(CcttBulletinEntity::getBulletinNum)
				.collect(Collectors.toList());
	}

	public List<String> getBulletinTypeValues() {
		List<CcttBulletinEntity> bulletinTypeValues = ccttBulletinJpaRepository
				.findAll();
		List<String> bulletinNameSet = new ArrayList<String>();
		for (CcttBulletinEntity types : bulletinTypeValues) {

			if (types.getBulletinTypeCode().equals(20000043)) {
				bulletinNameSet.add("PRODUCT BULLETIN");
			}
			if (types.getBulletinTypeCode().equals(20000042)) {
				bulletinNameSet.add("SERVICE BULLETIN");
			}
			if (types.getBulletinTypeCode().equals(2726)) {
				bulletinNameSet.add("SYSTEM BULLETIN");
			}
		}
		return new ArrayList<String>(new HashSet<String>(bulletinNameSet));
	}

	public Integer getBulletinTypeCode(String bulletinTypeCode) {
		if (bulletinTypeCode.equalsIgnoreCase("PRODUCT BULLETIN")) {
			return 20000043;
		} else if (bulletinTypeCode.equalsIgnoreCase("SERVICE BULLETIN")) {
			return 20000042;
		} else if (bulletinTypeCode.equalsIgnoreCase("SYSTEM BULLETIN")) {
			return 2726;
		} else {
			return 0;
		}

	}

	public Integer getCategoryCode(String category) {
		System.out.println("Category:" + category);
		switch (category) {
		case "SPS CONVERSION":
			return 20000028;
		case "ALERT":
			return 20000019;
		case "CAMPAIGN":
			return 20000020;
		case "ROUTINE":
			return 20000021;
		case "OPTIONAL":
			return 20000022;

		default:
			return 1;

		}

	}

	/*
	 * public List<String> getBulletinTypeValues(){ List<CcttBulletinEntity>
	 * bulletinTypeValues = ccttBulletinJpaRepository.findAll(); }
	 */

	/*
	 * @Autowired ComtApplicationCodeJpaRepository codeJpaRepository;
	 * 
	 * public Map<Integer, Object> getCategoryAndTimings(String codeType) {
	 * List<ComtApplicationCodeEntity> categories = codeJpaRepository
	 * .findByCodeType(codeType);
	 * 
	 * Map<Integer, Object> idDescriptionMap = new HashMap<Integer, Object>();
	 * for (ComtApplicationCodeEntity codes : categories) {
	 * idDescriptionMap.put( codes.getCodeId(), new Object[] {
	 * codes.getCodeName(), codes.getCodeDescription() }); } return
	 * idDescriptionMap; }
	 */

	public List<String> getSerialValues(String productLine,
			Integer bulletinTypeCode) {
		List<String> serials = new ArrayList<String>();
		List<CcttCrProductEntity> cccpList = ccttcrRepository
				.findByProductLine(productLine);
		// Integer bulletinTypeCode = getBulletinTypeCode(bulletinType);
		if (bulletinTypeCode == 2726) {
			for (CcttCrProductEntity serial : cccpList) {
				serials.add(serial.getProductSerialNum());
			}
		} else {
			List<CcttProductTypeEntity> ccttProTypeList = ccttProductTRepository
					.findByBulletinTypeCode(bulletinTypeCode);
			for (CcttCrProductEntity crProduct : cccpList) {
				for (CcttProductTypeEntity proType : ccttProTypeList) {
					if (crProduct.getProductType().equals(
							proType.getProductType())) {
						serials.add(crProduct.getProductSerialNum());
					}
				}
			}

		}
		return serials;
	}

	/*
	 * @Autowired public Object getCategoryAndTimings(String codeType) {
	 * 
	 * List<ComtApplicationCodeEntity> categories =
	 * codeJpaRepository.findByCodeType(codeType);
	 * 
	 * Map<Long, Object> idDescriptionMap = new HashMap<Long, Object>(); for
	 * (ComtApplicationCodeEntity codes : categories) { idDescriptionMap.put(
	 * codes.getCodeId(), new Object[] { codes.getCodeName(),
	 * codes.getCodeDescription() }); } return idDescriptionMap;
	 * 
	 * }
	 */

	public List<ComtApplicationCodeEntity> getCode(String codeType) {

		return codeJpaRepository.findByCodeTypeOrderByCodeName(codeType);
	}

	public Object insertBulletin(String bulletinNum, String bulletinStatus,
			Integer bulletinTypeCode, String category, String complianceLevel,
			String createdBy, Object createdDate, Date issueDate,
			String lastUpdatedBy, Object lastUpdatedDate, Integer latestRevId,
			String remarks, Date revisionDate, String significant,
			String supercededBulletinNum, String trackImplimentationPlan,
			String voucherProgram, String fieldImplementationMetric,
			String productLine, String description, String revision,
			String[] fromSerials, String[] toSerials, Integer[] timings)
			throws DatabaseValidationException,Exception {
		CcttBulletinEntity bulletinEnt = new CcttBulletinEntity();
		CcttBulletinRevisionEntity revEnt = new CcttBulletinRevisionEntity();
		CcttProductLineEntity plEnt = ccttProductLineJpaRepository
				.findByProductLine(productLine);

		bulletinStatus = "EFFECTIVE";

		
		
		int temp = ccttBulletinJpaRepository.findByBulletinNum(bulletinNum)
				.size();

		
		if (supercededBulletinNum.equals(null)) {
			
			supercededBulletinNum = " ";
		}
		if (temp != 0) {
			
			throw new DatabaseValidationException("The selected bulletin num "
					+ bulletinNum + " already present, please enter new Bulletin#");
		} else {

			bulletinEnt.setBulletinNum(bulletinNum);
			bulletinEnt.setBulletinStatus(bulletinStatus);
			bulletinEnt.setBulletinTypeCode(bulletinTypeCode);
			bulletinEnt.setProductLine(plEnt.getProductLine());

			bulletinEnt.setCreatedBy(createdBy);
			bulletinEnt.setCreatedDate(new Date());
			bulletinEnt.setIssueDate(issueDate);
			bulletinEnt.setLastUpdatedBy(createdBy);
			bulletinEnt.setLastUpdatedDate(new Date());
			bulletinEnt.setLatestRevId(0);
			bulletinEnt.setSupercededBulletinNum(supercededBulletinNum);

			ccttBulletinJpaRepository.save(bulletinEnt);
			for (int i = 0; i < timings.length; i++) {
				revEnt.setBulletinDesc(description);
				revEnt.setBulletinNum(bulletinNum);
				revEnt.setBulletinRevision(revision);
				revEnt.setCategoryCode(20000028);
				revEnt.setComplianceLevel(complianceLevel);
				revEnt.setCreatedBy(createdBy);
				revEnt.setCreatedDate(new Date());

				// Only while updating.
				revEnt.setLastUpdatedBy(createdBy);
				revEnt.setLastUpdatedDate(new Date());
				revEnt.setRemarks(remarks);
				revEnt.setRevDate(revisionDate);
				revEnt.setRevId(0);
				// revEnt.setTimingCode(getCode("TIMING_CODE")); //refers to
				// code_id
				// in comt_application_code table - code_type = 'TIMING_CODE'

				revEnt.setTrackImplementationInd(trackImplimentationPlan);

				revEnt.setSignificantInd(significant);

				revEnt.setVoucherProgramInd(voucherProgram);

				revEnt.setFieldImplMetricInd(fieldImplementationMetric);

				revEnt.setTimingCode(timings[i]);

				for (int j = 0; j < fromSerials.length; j++) {
					CcttBulletinProductEntity serialEnt = new CcttBulletinProductEntity();
					serialEnt.setBulletinNum(bulletinNum);
					serialEnt.setRevId(0);
					serialEnt.setFromSerialNum(fromSerials[j]);
					serialEnt.setToSerialNum(toSerials[j]);
					serialEnt.setTimingCode(timings[i]);
					serialEnt.setCreatedBy(createdBy);
					serialEnt.setCreatedDate(new Date());
					serialEnt.setLastUpdatedBy(createdBy);
					serialEnt.setLastUpdatedDate(new Date());
					serialEnt.setCmplEndDate(new Date());
					ccttBulletinProductJpaRepository.save(serialEnt);
				}

				ccttBulletinRevisionJpaRepository.save(revEnt);
			}
			return 1;

		}

	}

	public Object updateBulletin(String bulletinNum, String bulletinStatus,
			Integer bulletinTypeCode, String category, String complianceLevel,
			String createdBy, Date createdDate, Date issueDate,
			String lastUpdatedBy, Date lastUpdatedDate, Integer latestRevId,
			String remarks, Date revisionDate, String significant,
			String supercededBulletinNum, String trackImplimentationPlan,
			String voucherProgram, String fieldImplementationMetric,
			String productLine, String description, String revision,
			String[] fromSerials, String[] toSerials, Integer[] timings,
			Boolean newRevision) {

		CcttBulletinEntity bulletinEnt = new CcttBulletinEntity();
		CcttBulletinRevisionEntity revEnt = new CcttBulletinRevisionEntity();
		bulletinEnt = getBulletin(bulletinNum);
		bulletinEnt.setLastUpdatedBy(createdBy);
		bulletinEnt.setLastUpdatedDate(new Date());
		if (newRevision)
			bulletinEnt.setLatestRevId(bulletinEnt.getLatestRevId() + 1);

		System.out.println("Timings length :" + timings.length);
		for (int i = 0; i < timings.length; i++) {
			revEnt.setBulletinDesc(description);
			revEnt.setBulletinNum(bulletinNum);
			revEnt.setBulletinRevision(revision);
			// if null, set it to 0. If
			// not 0, increment it. If
			// 0, and 0 already exists,
			// check for different value
			// of timing.
			revEnt.setCategoryCode(getCategoryCode(category)); // refers to
																// code_id in
			// comt_application_code
			// table -
			// code_type =
			// 'BULLETIN_CATEGORY'

			revEnt.setComplianceLevel(complianceLevel); // Hardcoded in
														// Constant.java
			revEnt.setCreatedBy(createdBy);
			revEnt.setCreatedDate(new Date());

			// Only while updating.
			revEnt.setLastUpdatedBy(createdBy);
			revEnt.setLastUpdatedDate(new Date());
			revEnt.setRemarks(remarks);
			revEnt.setRevDate(revisionDate);
			if (newRevision)
				revEnt.setRevId(bulletinEnt.getLatestRevId() + 1);
			else
				revEnt.setRevId(latestRevId);
			// revEnt.setTimingCode(getCode("TIMING_CODE")); //refers to code_id
			// in comt_application_code table - code_type = 'TIMING_CODE'

			revEnt.setTrackImplementationInd(trackImplimentationPlan);

			revEnt.setSignificantInd(significant);

			revEnt.setVoucherProgramInd(voucherProgram);

			revEnt.setFieldImplMetricInd(fieldImplementationMetric);

			revEnt.setTimingCode(timings[i]);

			for (int j = 0; j < fromSerials.length; j++) {
				CcttBulletinProductEntity serialEnt = new CcttBulletinProductEntity();
				serialEnt.setBulletinNum(bulletinNum);
				if (newRevision)
					serialEnt.setRevId(bulletinEnt.getLatestRevId() + 1);
				else
					serialEnt.setRevId(latestRevId);

				serialEnt.setFromSerialNum(fromSerials[j]);
				serialEnt.setToSerialNum(toSerials[j]);
				serialEnt.setTimingCode(timings[i]);
				serialEnt.setCreatedBy(createdBy);
				serialEnt.setCreatedDate(new Date());
				serialEnt.setLastUpdatedBy(createdBy);
				serialEnt.setLastUpdatedDate(new Date());
				serialEnt.setCmplEndDate(new Date());
				ccttBulletinProductJpaRepository.save(serialEnt);
			}

			ccttBulletinRevisionJpaRepository.save(revEnt);
		}
		ccttBulletinJpaRepository.save(bulletinEnt);
		// }
		return 1;
	}

	public Object getBulletins(Integer bulletinTypeCode, String productLine) {
		// TODO Auto-generated method stub
		return ccttBulletinJpaRepository
				.findByBulletinTypeCodeAndProductLineOrderByBulletinNum(
						bulletinTypeCode, productLine);
	}

	public List<CcttBulletinRevisionEntity> bulletinRevisions(String bulletinNum) {
		// TODO Auto-generated method stub
		return ccttBulletinRevisionJpaRepository
				.findByCompositePrimaryKeyBulletinNum(bulletinNum);
	}

	public String bulletinCodeValues(Long code) {
		// TODO Auto-generated method stub
		return codeJpaRepository.findByCodeId(code).getCodeDescription();
	}

	/*
	 * Testing predicate builder
	 * ************************************************
	 * ***********************************************************
	 */
	public void testingpredicate() {
		// EntityManager em = Persistence.createEntityManagerFactory(
		// "Eclipselink_JPA" ); ;
		// CriteriaBuilder predicateBuilder = em.getCriteriaBuilder();

	}

}