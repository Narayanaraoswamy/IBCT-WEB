package com.ge.pw.ibct.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttBulletinEntity;
import com.ge.pw.ibct.utils.BulletinTypes;

/**
 * Repository : CcttBulletin.
 */
public interface CcttBulletinJpaRepository extends PagingAndSortingRepository<CcttBulletinEntity, String> {
	List<CcttBulletinEntity> findByBulletinNum(String bulletinNum);
	List<CcttBulletinEntity> findAll();
	
	CcttBulletinEntity findOne(String bulletinNum);
	
	List<CcttBulletinEntity> findByBulletinTypeCodeAndProductLineAndBulletinStatus(Integer bulletinTypeCode,String productLine,String bulletinStatus);
	<S extends CcttBulletinEntity> S save(S entity);
	List<CcttBulletinEntity> findByBulletinTypeCodeAndProductLineOrderByBulletinNum(Integer bulletinTypeCode, String productLine);
}
