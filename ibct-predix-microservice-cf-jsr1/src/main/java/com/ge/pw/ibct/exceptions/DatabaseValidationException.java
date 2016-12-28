package com.ge.pw.ibct.exceptions;

public class DatabaseValidationException extends Throwable{
	private static final long serialVersionUID = 7140161024945758893L;

	public DatabaseValidationException() {
		// TODO Auto-generated constructor stub
	}
	public DatabaseValidationException(String exceptionMessage){
		super(exceptionMessage);
	}
}
