package com.yellowice.config;

import com.yellowice.service.JWTService;
import com.yellowice.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    ApplicationContext context;


    /**
     * Filtre de sécurité JWT qui intercepte les requêtes HTTP pour extraire le token JWT de l'en-tête Authorization,
     * valider le token, Authentifier l'utilisateur correspondant si le token est valide
     * En cas de token invalide ou expiré, la requête est bloquée et une réponse HTTP 401 est renvoyée
     *
     * @param request la requête HTTP entrante
     * @param response la requête HTTP sortante
     * @param filterChain la chaîne des filtres de sécurité
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //permet au front end d'accéder au header (pour le refresh token)
        response.addHeader("Access-Control-Expose-Headers", "Authorization");


        String token = null;
        String username = null;

        //Récupère le header Authorization de la requête
        String authHeader = request.getHeader("Authorization");

        //vérifie que le header est bien présent et commence par "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtService.extractUserName(token);
            } catch (Exception e) {
                //token invalide ou expiré, renvoie une erreur 401
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Token invalide ou expiré\"}");
                return;
            }
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token invalide\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
