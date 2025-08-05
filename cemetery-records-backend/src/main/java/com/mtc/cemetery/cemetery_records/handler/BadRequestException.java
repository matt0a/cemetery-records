package com.mtc.cemetery.cemetery_records.handler;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
