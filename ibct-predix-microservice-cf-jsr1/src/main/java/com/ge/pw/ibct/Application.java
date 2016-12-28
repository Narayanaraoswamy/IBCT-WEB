package com.ge.pw.ibct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@ComponentScan({"com.ge.pw.ibct.services","com.ge.pw.ibct.controllers"})
@EnableAutoConfiguration
@EntityScan(basePackages=("com.ge.pw.ibct.entity"))
@EnableJpaRepositories("com.ge.pw.ibct.repository")
@CrossOrigin
public class Application {
	
    public static void main(String[] args) throws Exception{
    	SpringApplication.run(Application.class, args);
    }
}

