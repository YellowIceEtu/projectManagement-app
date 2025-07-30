package com.yellowice.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    //classe DTO permettant de retourner seulement les informations utiles lors de l'inscription à l'application web

    private String username;
    private String email;
    private String password;
}
