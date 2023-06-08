package com.licenta.service.dto;

import com.licenta.domain.enumeration.TaskPriority;
import com.licenta.domain.enumeration.TaskStatus;
import javax.validation.constraints.NotNull;

public class TaskEditDTO {

    @NotNull
    private String title;

    private String description;

    private TaskStatus status;

    private Float estimatedTime;

    private Float timeLogged;

    private Integer storyPoints;

    private TaskPriority priority;

    private String assignee;

    private String reporter;

    public TaskEditDTO(
        String title,
        String description,
        TaskStatus status,
        Float estimatedTime,
        Float timeLogged,
        Integer storyPoints,
        TaskPriority priority,
        String assignee,
        String reporter
    ) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.estimatedTime = estimatedTime;
        this.timeLogged = timeLogged;
        this.storyPoints = storyPoints;
        this.priority = priority;
        this.assignee = assignee;
        this.reporter = reporter;
    }

    public TaskEditDTO() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Float getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Float estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Float getTimeLogged() {
        return timeLogged;
    }

    public void setTimeLogged(Float timeLogged) {
        this.timeLogged = timeLogged;
    }

    public Integer getStoryPoints() {
        return storyPoints;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }
}
