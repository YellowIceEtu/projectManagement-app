package com.yellowice.dto;

import com.yellowice.model.User;
import lombok.Data;

@Data
public class UserDTO {

    //classe DTO retournant l'utilisateur sans le mot de passe pour plus de sécurité

    private Long id;
    private String username;
    private String email;


    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
    }
}



