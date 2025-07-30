package com.yellowice.controller;


import com.yellowice.dto.*;
import com.yellowice.model.User;
import com.yellowice.service.JWTService;
import com.yellowice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class UserController {


    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    UserDetailsService userDetailsService;


    /**
     * Appelle le service pour récupérer enregistrer un nouvel utilisateur
     * @param registerRequest objet contenant le username, l'email et le mot de passe de l'utilisateur
     * @return une réponse http contenant l'utilisateur
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequest registerRequest){

        if(registerRequest.getPassword() == null){
            throw new IllegalArgumentException("Password cannot be null");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());

        User registerUser = this.userService.register(user);
        return ResponseEntity.ok(new UserDTO(registerUser));
    }


    /**
     * Appelle le service pour l'authentification de l'utilisateur, si les identifiants sont valides,
     * un access token et refresh token sont générés et retournés
     * @param user utilisateur avec les informations fournis
     * @return une réponse http contenant le l'access et le refresh token
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user){

        try {
            // Vérifie l'utilisateur
            String token = userService.verify(user);
            System.out.println("Access Token généré par le backend : " + token); // Debug 🔍

            // Génère un refresh token
            String refreshToken = jwtService.generateRefreshToken(user.getEmail());
            System.out.println("Refresh Token généré par le backend : " + refreshToken); // Debug 🔍

            // Crée une map pour renvoyer les tokens sous la forme d'un objet JSON
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", token);
            response.put("refreshToken", refreshToken);

            // Retourne la map en tant que réponse JSON avec un statut HTTP 200 (OK)
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", " Email ou mot de passe incorect"));
        }
    }


    /**
     *  appelle le service pour récupérer l'id de l'utilisateur connecté
     * @return uen réponse http avec l'id de l'utilisateur
     */
    @GetMapping("/userId")
    public ResponseEntity<Long> getUserId(){
        User user1 = userService.getCurrentUser();
        System.out.println("L'id de l'utilisateur : " + user1);
        return ResponseEntity.ok(user1.getId());
    }


    /**
     * Appelle le service pour récupérer les informations de l'utilisateur connecté
     * @return une réponse http contenant l'utilisateur  connecté
     */
    @GetMapping("/me")
    public ResponseEntity<User> getUser(){
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    /**
     * Appelle le service pour récupérer un utilisateur grâce à son mail
     * @param email l'email de l'utilisateur a trouver
     * @return une réponse http avec l'utilisateur trouvé
     */
    @GetMapping("/info")
    public ResponseEntity<User> getInfo(@RequestParam String email){
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }


//    @PutMapping("/updateUser")
//    public ResponseEntity<?> updateUser(@RequestBody User userUpdate) {
//        User updatedUser = userService.updateUser(userUpdate);
//
//        String newToken = jwtService.generateToken(updatedUser.getEmail());
//        String newRefreshToken = jwtService.generateRefreshToken(updatedUser.getEmail());
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("user", updatedUser); // Tu peux aussi utiliser un DTO pour cacher le mot de passe
//        response.put("token", newToken);
//        response.put("refreshToken", newRefreshToken);
//
//        return ResponseEntity.ok(response);
//    }

    /**
     * Appelle les services pour mettre à jour l'utilisateur et générer un nouveau access et refresh token
     * @param userUpdate l'utilisateur avec les nouvelles informations
     * @return une réponse http contenant un objet avec le nouvel utilisateur mis à jour, l'acces et refresh token
     */
    @PutMapping("/updateUser")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody User userUpdate) {
        User updatedUser = userService.updateUser(userUpdate);

        UserDTO userDTO = new UserDTO(updatedUser);

        String newToken = jwtService.generateToken(updatedUser.getEmail());
        String newRefreshToken = jwtService.generateRefreshToken(updatedUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("user", userDTO);
        response.put("token", newToken);
        response.put("refreshToken", newRefreshToken);

        return ResponseEntity.ok(response);
    }


    /**
     * rafraîchit le token d'accès en utilisant un refresh token
     * @param request Objet contenant le refresh token envoyé par le client
     * @return une réponse http contenant un nouvel acces token et un nouveau refresh token dans un AuthResponse
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshToken request) {
        String refreshToken = request.getRefreshToken();
        try {
            String email = jwtService.extractUserName(refreshToken);

            if (!jwtService.validateToken(refreshToken, (UserDetails) userDetailsService.loadUserByUsername(email))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
            }

            String newToken = jwtService.generateToken(email);
            String newRefreshToken = jwtService.generateRefreshToken(email);

            return ResponseEntity.ok(new AuthResponse(newToken, newRefreshToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
        }
    }


    /**
     * Appelle le service pour récupérer les collaborateurs (user)
     * @return une réponse http contenant une liste d'utilisateurs
     */
    @GetMapping("/collaborators")
    public ResponseEntity<List<UserDTO>> getTasks(){
        List<UserDTO> users = userService.getCollaborators()
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
