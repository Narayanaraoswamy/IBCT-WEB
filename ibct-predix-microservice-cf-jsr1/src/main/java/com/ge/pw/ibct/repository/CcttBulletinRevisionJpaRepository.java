package com.ge.pw.ibct.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttBulletinRevisionEntity;
import com.ge.pw.ibct.entity.CcttBulletinRevisionEntityKey;

/**
 * Repository : CcttBulletinRevision.
 */
public interface CcttBulletinRevisionJpaRepository extends PagingAndSortingRepository<CcttBulletinRevisionEntity, CcttBulletinRevisionEntityKey> {

	List<CcttBulletinRevisionEntity> findByCompositePrimaryKeyBulletinNum(String bulletinNum);

}
