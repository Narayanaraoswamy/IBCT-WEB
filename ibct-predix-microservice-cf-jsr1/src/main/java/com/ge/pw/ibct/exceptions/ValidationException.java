package com.ge.pw.ibct.exceptions;

public class ValidationException extends Throwable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7140161024945758893L;

	public ValidationException() {

	}

	public ValidationException(String exceptionMessage) {
		super(exceptionMessage);
	}
}
