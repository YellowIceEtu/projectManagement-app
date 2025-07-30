package com.yellowice.dto;


import lombok.Data;

@Data
public class AuthResponse {

    //classe DTO pour retourner les nouveaux tokens lors du rafraîchissement du refresh token

    private String accessToken;
    private String refreshToken;

    public AuthResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
