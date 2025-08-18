package com.yellowice.dto;

import com.yellowice.model.EnumActions;
import com.yellowice.model.History;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistoryDTO {

    private Long id;
    private EnumActions actions;
    private String description;
    private LocalDateTime timestamp;
    private String projectName;
    private String taskTitle;
    private UserDTO user;

    public HistoryDTO(History history){
        this.id = history.getId();
        this.actions = history.getActions();
        this.description = history.getDescription();
        this.timestamp = history.getTimestamp();
        this.user = new UserDTO(history.getPerformedBy());
        this.projectName = history.getProjectName();
        this.taskTitle = history.getTaskTitle();
    }

}
