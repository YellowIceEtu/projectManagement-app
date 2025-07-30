package com.yellowice.service;

import com.yellowice.dao.UserRepository;
import com.yellowice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {


    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepository;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    /**
     * Créer et sauvegarde un utilisateur en encodant le mot de passe
     * @param user l'utilisateur à enregistrer
     * @return un User avec le mot de passe encodé
     */
    public User register(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }

    /**
     * Authentifie un utilisateur grâce à l'email et le mot de passe
     * Si l'authentification réussit, génère et retourne un token
     * @param user utilisateur contenant l'email et le mot de passe
     * @return un jwt token si l'authentification est réussit
     */
    public String verify(User user) {
        try{
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            if (authentication.isAuthenticated())
                return jwtService.generateToken(user.getEmail());

        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
    }


    /**
     * Récupère l'utilisateur grâce à l'id
     * @param userId l'identification de l'utilisateur à trouver
     * @return l'utilisateur trouvé
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
    }


    /**
     * Récupère un utilisateur grâce à un email
     * @param email l'email de l'utilisateur a trouver
     * @return l'utilisateur trouvé grâce à l'email
     */
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    /**
     * Récupère l'utilisateur actuellement connecté
     * @return l'utilisateur connecté
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null; // Aucun utilisateur connecté
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email);

    }


    /**
     *  Modifie l'utilisateur avec les nouvelles informations, si nouveau mot de passe fourni
     *  alors il est encodé
     * @param userUpdate l'utilisateur contenant les nouvelles informations
     * @return l'utilisateur mis à jour
     */
    public User updateUser(User userUpdate){
        User getUser = getCurrentUser();
        getUser.setUsername(userUpdate.getUsername());
        getUser.setEmail(userUpdate.getEmail());

        if(userUpdate.getPassword() !=null && !userUpdate.getPassword().isBlank()) {
            getUser.setPassword(encoder.encode(userUpdate.getPassword()));
        }
        User savedUser = userRepository.save(getUser);
        return savedUser;

    }

    /**
     * Récupère tous les collaborateurs
     * @return une liste d'utilisateurs
     */
    public List<User> getCollaborators(){
        return this.userRepository.findAll();
    }

}
