package com.ge.pw.ibct.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;

import com.ge.pw.ibct.beans.CcttProductLine;
import com.ge.pw.ibct.beans.CcttProductType;
import com.ge.pw.ibct.repository.CcttBulletinJpaRepository;
import com.ge.pw.ibct.repository.CcttProductLineJpaRepository;
import com.ge.pw.ibct.entity.CcttBulletinEntity;
import com.ge.pw.ibct.entity.CcttProductLineEntity;

@Service
public class ProductService{
	
	@Autowired
	CcttProductLineJpaRepository ccttProductLineJpaRepository;
	public List<CcttProductLineEntity> getProductLine()
	{
		return ccttProductLineJpaRepository.findAll();
	}
	
}