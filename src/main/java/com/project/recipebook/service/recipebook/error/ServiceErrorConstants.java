package com.project.recipebook.service.recipebook.error;

import java.net.URI;

public final class ServiceErrorConstants {
    
    public static final String PROBLEM_BASE_URL = "https://www.jhipster.tech/problem";
    public static final URI DEFAULT_TYPE = URI.create(PROBLEM_BASE_URL + "/problem-with-message");

    private ServiceErrorConstants() {}
}
