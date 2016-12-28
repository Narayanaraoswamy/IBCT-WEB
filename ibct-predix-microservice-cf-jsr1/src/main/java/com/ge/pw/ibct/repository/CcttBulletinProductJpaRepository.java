package com.ge.pw.ibct.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttBulletinProductEntity;
import com.ge.pw.ibct.entity.CcttBulletinProductEntityKey;

/**
 * Repository : CcttBulletinProduct.
 */
public interface CcttBulletinProductJpaRepository extends PagingAndSortingRepository<CcttBulletinProductEntity, CcttBulletinProductEntityKey> {
	<S extends CcttBulletinProductEntity> S save(S entity);
}
