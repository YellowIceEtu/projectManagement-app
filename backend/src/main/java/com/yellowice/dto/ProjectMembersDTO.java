package com.yellowice.dto;

import com.yellowice.model.Project;
import com.yellowice.model.User;
import lombok.Data;

import java.util.List;

@Data
public class ProjectMembersDTO {

    private UserDTO owner;
    private List<UserDTO> collaborators;

    public ProjectMembersDTO(UserDTO projectOwner, List<UserDTO> projectCollaborators){
        this.owner = projectOwner;
        this.collaborators = projectCollaborators;
    }
}
