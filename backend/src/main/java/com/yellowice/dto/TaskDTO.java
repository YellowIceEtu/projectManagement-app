package com.yellowice.dto;

import com.yellowice.model.EnumStatus;
import com.yellowice.model.Task;
import lombok.Data;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate creationDate;
    private List<UserDTO> collaborators;
    private EnumStatus status;
    private Long projectId;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.startDate = task.getStartDate();
        this.endDate = task.getEndDate();
        this.creationDate = task.getCreationDate();
        this.status = task.getStatus();
        this.collaborators = task.getCollaborators()
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        this.projectId = task.getProject().getId();

    }}
