package com.ge.pw.ibct.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttProductLineEntity;
import com.ge.pw.ibct.utils.Queries;

/**
 * Repository : CcttProductLine.
 */
public interface CcttProductLineJpaRepository extends PagingAndSortingRepository<CcttProductLineEntity, String> {
	
		//@Query(Queries.PRODUCT_LINE)
		List<CcttProductLineEntity> findAll();

		CcttProductLineEntity findByProductLine(String productLine);
}
