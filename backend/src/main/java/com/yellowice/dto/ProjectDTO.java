package com.yellowice.dto;

import com.yellowice.model.EnumStatus;
import com.yellowice.model.Project;
import com.yellowice.model.Task;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProjectDTO {

    private Long id;
    private String name;
    private String description;
    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private UserDTO owner;
    private List<UserDTO> collaborators;
    private EnumStatus status;
    private List<TaskDTO> task;

    public ProjectDTO(Project project){
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.status = project.getStatus();
        this.creationDate = project.getCreationDate();
        this.collaborators = project.getCollaborators()
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        this.owner =  new UserDTO(project.getOwner());
        this.task = project.getTasks()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());





    }
}
