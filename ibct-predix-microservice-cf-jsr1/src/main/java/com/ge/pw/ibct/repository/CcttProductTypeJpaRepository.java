package com.ge.pw.ibct.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttProductTypeEntity;
import com.ge.pw.ibct.utils.Queries;

/**
 * Repository : CcttProductType.
 */
public interface CcttProductTypeJpaRepository extends PagingAndSortingRepository<CcttProductTypeEntity, String> {

	List<CcttProductTypeEntity> findByBulletinTypeCode(Integer bulletinTypeCode);
		
		//@Query(Queries.PRODUCT_TYPE)
		//List getProductTypes();
		
		//Object findOne()
}
