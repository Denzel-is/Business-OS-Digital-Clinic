package com.denzelis.businessos.project.application;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException() {
        super("Project not found");
    }
}
