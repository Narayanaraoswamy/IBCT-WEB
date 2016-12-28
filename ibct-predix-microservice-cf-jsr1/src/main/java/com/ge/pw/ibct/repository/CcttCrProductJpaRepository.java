package com.ge.pw.ibct.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.CcttCrProductEntity;

/**
 * Repository : CcttCrProduct.
 */
public interface CcttCrProductJpaRepository extends PagingAndSortingRepository<CcttCrProductEntity, Integer> {

	List<CcttCrProductEntity> findByProductLine(String productLine);

}
