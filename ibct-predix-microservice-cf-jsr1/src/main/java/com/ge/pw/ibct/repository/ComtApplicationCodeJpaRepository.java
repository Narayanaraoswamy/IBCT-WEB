package com.ge.pw.ibct.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.ge.pw.ibct.entity.ComtApplicationCodeEntity;

/**
 * Repository : ComtApplicationCode.
 */
public interface ComtApplicationCodeJpaRepository extends PagingAndSortingRepository<ComtApplicationCodeEntity, Long> {

	List<ComtApplicationCodeEntity> findByCodeTypeOrderByCodeName(String codeType);

	ComtApplicationCodeEntity findByCodeId(Long code);

}
