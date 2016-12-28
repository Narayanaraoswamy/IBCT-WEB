package com.ge.pw.ibct.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.ge.pw.ibct.dto.AddBulletinDto;
import com.ge.pw.ibct.dto.ApplicationCodesDto;
//import com.ge.pw.ibct.dto.AddBulletinDto.Serials;
import com.ge.pw.ibct.dto.Bulletindto;
import com.ge.pw.ibct.dto.RevisionsDto;
import com.ge.pw.ibct.dto.UpdateBulletinDto;
import com.ge.pw.ibct.entity.CcttBulletinRevisionEntity;
import com.ge.pw.ibct.exceptions.DatabaseValidationException;
import com.ge.pw.ibct.exceptions.ValidationException;
import com.ge.pw.ibct.services.BulletinService;
import com.ge.pw.ibct.utils.CommonUtil;
import com.ge.pw.ibct.utils.WSResponseStatus;

@RestController
@RequestMapping("/ibct")
public class BulletinController {

	Bulletindto bulletindto;

	@Autowired
	BulletinService bulletinService;

	@RequestMapping("/Bulletin/{bullNum}")
	public @ResponseBody WSResponseStatus getBulletin(
			@PathVariable String bullNum) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		wsResponseStatus.setData(bulletinService.getBulletin(bullNum));
		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping(value = "/Bulletin/Superced", method = RequestMethod.POST)
	public @ResponseBody WSResponseStatus getSupercedValues(
			@RequestBody AddBulletinDto bulletin) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		try {
			wsResponseStatus.setData(bulletinService.getSupercedValues(
					bulletin.getBulletinTypeCode(), bulletin.getProductLine(),
					bulletin.getBulletinStatus()));
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}

	}

	@CrossOrigin
	@RequestMapping(value = "/Bulletin/Bulletins", method = RequestMethod.POST)
	public @ResponseBody WSResponseStatus getBulletins(
			@RequestBody AddBulletinDto bulletin) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		try {
			wsResponseStatus.setData(bulletinService.getBulletins(
					bulletin.getBulletinTypeCode(), bulletin.getProductLine()));
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}

	}

	@CrossOrigin
	@RequestMapping(value = "/Bulletin/CancelBulletin", method = RequestMethod.POST)
	public @ResponseBody WSResponseStatus cancelBulletin(
			@RequestBody Bulletindto bulletin) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		try {
			wsResponseStatus.setData(bulletinService.cancelBulletin(bulletin
					.getBulletinNum()));
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
	}

	@CrossOrigin
	@RequestMapping(value = "/Bulletin/Revisions", method = RequestMethod.POST)
	public @ResponseBody WSResponseStatus bulletinRevisions(
			@RequestBody Bulletindto bulletin) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		try {
			List<RevisionsDto> lstRevisionsDto = new ArrayList<RevisionsDto>();
			RevisionsDto objRevisionsDto = new RevisionsDto();
			List<CcttBulletinRevisionEntity> revisions = bulletinService
					.bulletinRevisions(bulletin.getBulletinNum());
			for (CcttBulletinRevisionEntity revi : revisions) {
				objRevisionsDto = new RevisionsDto();
				objRevisionsDto.setRevisionId(revi.getRevId());
				objRevisionsDto.setRevision(revi.getBulletinRevision());
				objRevisionsDto.setCategory(bulletinService
						.bulletinCodeValues(Long.parseLong(revi
								.getCategoryCode().toString())));
				objRevisionsDto.setComplianceLevel(revi.getComplianceLevel());
				objRevisionsDto.setRevisionDate(revi.getRevDate());
				objRevisionsDto.setRevisionDescription(revi.getBulletinDesc());
				objRevisionsDto.setTrackImplimentationPlan(revi
						.getTrackImplementationInd());
				objRevisionsDto.setBulletinNum(revi.getBulletinNum());
				objRevisionsDto.setTimingCode(revi.getTimingCode());
				lstRevisionsDto.add(objRevisionsDto);
			}
			wsResponseStatus.setData(lstRevisionsDto);
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
	}

	@CrossOrigin
	@RequestMapping(value = "/Bulletin/Codes/{code}", method = RequestMethod.GET)
	public @ResponseBody WSResponseStatus codeValues(@PathVariable Long code) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		try {
			wsResponseStatus.setData(bulletinService.bulletinCodeValues(code));
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/BulletinTypes")
	public @ResponseBody WSResponseStatus getBulletinTypeValues()
			throws IOException {

		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		wsResponseStatus.setData(bulletinService.getBulletinTypeValues());

		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/CodeDescription/{codeType}")
	public @ResponseBody WSResponseStatus getCategoryCodeValues(
			@PathVariable String codeType) throws IOException {

		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		// wsResponseStatus.setData(bulletinService
		// .getCategoryAndTimings(codeType));

		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/Serials/{productLine}/{bulletinTypeCode}")
	public @ResponseBody WSResponseStatus getSerials(
			@PathVariable String productLine,
			@PathVariable Integer bulletinTypeCode)
			throws JsonGenerationException, JsonMappingException, IOException {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		wsResponseStatus.setData(bulletinService.getSerialValues(productLine,
				bulletinTypeCode));

		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/CodesOptions/{codeType}")
	public @ResponseBody WSResponseStatus getCode(@PathVariable String codeType) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);
		ApplicationCodesDto objApplicationCodesDto = new ApplicationCodesDto();

		wsResponseStatus.setData(objApplicationCodesDto
				.getTimingCodesFromEntity(bulletinService.getCode(codeType)));
		// wsResponseStatus.setData(bulletinService.getCode("TIMING_CODE"));
		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/Insert")
	public @ResponseBody WSResponseStatus insertBulletin(
			@RequestBody AddBulletinDto bulletinDetails) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		try {
			bulletinDetails.setCreatedDate(new Date());
			bulletinDetails.setLastUpdatedDate(new Date());
			bulletinDetails.setRevisionDate(new Date());

			wsResponseStatus.setData(bulletinService.insertBulletin(
					bulletinDetails.getBulletinNum(),
					bulletinDetails.getBulletinStatus(),
					bulletinDetails.getBulletinTypeCode(),
					bulletinDetails.getCategory(),
					bulletinDetails.getComplianceLevel(),
					bulletinDetails.getCreatedBy(),
					bulletinDetails.getCreatedDate(),
					bulletinDetails.getIssueDate(),
					bulletinDetails.getLastUpdatedBy(),
					bulletinDetails.getLastUpdatedDate(),
					bulletinDetails.getLatestRevId(),
					bulletinDetails.getRemarks(),
					bulletinDetails.getRevisionDate(),
					bulletinDetails.getSignificant(),
					bulletinDetails.getSupercededBulletinNum(),
					bulletinDetails.getTrackImplimentationPlan(),
					bulletinDetails.getVoucherProgram(),
					bulletinDetails.getFieldImplementationMetric(),
					bulletinDetails.getProductLine(),
					bulletinDetails.getDescription(),
					bulletinDetails.getRevision(),
					bulletinDetails.getFromserials(),
					bulletinDetails.getToserials(),
					bulletinDetails.getTimings()));

			return wsResponseStatus;

		} catch (DatabaseValidationException databaseException) {
			wsResponseStatus.setStatusMessage("error");
			wsResponseStatus.setErrorMsg(databaseException.getMessage());

		} catch (NullPointerException e) {
			wsResponseStatus.setStatusMessage("error");
			wsResponseStatus.setErrorMsg("Isuue Date is null");
		} catch (Exception ex) {
			wsResponseStatus.setStatusMessage("error");
			ex.printStackTrace();
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
		}
		return wsResponseStatus;
	}

	@CrossOrigin
	@RequestMapping("/Bulletin/Update")
	public @ResponseBody WSResponseStatus updateBulletin(
			@RequestBody AddBulletinDto bulletinDetails) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		try {
			bulletinDetails.setCreatedDate(new Date());
			bulletinDetails.setLastUpdatedDate(new Date());
			bulletinDetails.setRevisionDate(new Date());

			wsResponseStatus.setData(bulletinService.updateBulletin(
					bulletinDetails.getBulletinNum(),
					bulletinDetails.getBulletinStatus(),
					bulletinDetails.getBulletinTypeCode(),
					bulletinDetails.getCategory(),
					bulletinDetails.getComplianceLevel(),
					bulletinDetails.getCreatedBy(),
					bulletinDetails.getCreatedDate(),
					bulletinDetails.getIssueDate(),
					bulletinDetails.getLastUpdatedBy(),
					bulletinDetails.getLastUpdatedDate(),
					bulletinDetails.getLatestRevId(),
					bulletinDetails.getRemarks(),
					bulletinDetails.getRevisionDate(),
					bulletinDetails.getSignificant(),
					bulletinDetails.getSupercededBulletinNum(),
					bulletinDetails.getTrackImplimentationPlan(),
					bulletinDetails.getVoucherProgram(),
					bulletinDetails.getFieldImplementationMetric(),
					bulletinDetails.getProductLine(),
					bulletinDetails.getDescription(),
					bulletinDetails.getRevision(),
					bulletinDetails.getFromserials(),
					bulletinDetails.getToserials(),
					bulletinDetails.getTimings(),
					bulletinDetails.getNewRevision()));
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
		//
		// System.out.println("plList :"+i);

	}

	@CrossOrigin
	@RequestMapping("/Bulletin/BulletinDetails")
	public @ResponseBody WSResponseStatus getBulletinDetails(
			@RequestBody Bulletindto bulletinDetails) {
		WSResponseStatus wsResponseStatus = new WSResponseStatus();
		CommonUtil.populateWSResponseStatusSuccessResponse(wsResponseStatus);

		try {
			// @RequestBody AddBulletinDto bulletinDetails

			bulletinDetails.setCreatedDate(new Date());
			bulletinDetails.setLastUpdatedDate(new Date());
			UpdateBulletinDto objUpdateBulletinDto = new UpdateBulletinDto();
			objUpdateBulletinDto.setBulletinNum(bulletinDetails
					.getBulletinNum());
			List<RevisionsDto> lstRevisionsDto = new ArrayList<RevisionsDto>();
			RevisionsDto objRevisionsDto = new RevisionsDto();
			List<CcttBulletinRevisionEntity> revisions = bulletinService
					.bulletinRevisions(bulletinDetails.getBulletinNum());
			for (CcttBulletinRevisionEntity revi : revisions) {
				objRevisionsDto = new RevisionsDto();
				objRevisionsDto.setRevisionId(revi.getRevId());
				objRevisionsDto.setCategory(bulletinService
						.bulletinCodeValues(Long.parseLong(revi
								.getCategoryCode().toString())));
				objRevisionsDto.setComplianceLevel(revi.getComplianceLevel());
				objRevisionsDto.setRevisionDate(revi.getRevDate());
				objRevisionsDto.setRevisionDescription(revi.getBulletinDesc());
				objRevisionsDto.setTrackImplimentationPlan(revi
						.getTrackImplementationInd());
				objRevisionsDto.setBulletinNum(revi.getBulletinNum());
				objRevisionsDto.setTimingCode(revi.getTimingCode());
				objRevisionsDto.setSignificant(revi.getSignificantInd());

				lstRevisionsDto.add(objRevisionsDto);
			}
			objUpdateBulletinDto.setRevisions(lstRevisionsDto);
			wsResponseStatus.setData(objUpdateBulletinDto);
			return wsResponseStatus;
		} catch (Exception ex) {
			CommonUtil.populateWSResponseStatusFailsureStatusResponse(
					wsResponseStatus, ex.fillInStackTrace().toString());
			return wsResponseStatus;
		}
		//
		// System.out.println("plList :"+i);

	}
}