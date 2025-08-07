package com.yellowice.controller;

import com.yellowice.dto.ProjectDTO;
import com.yellowice.dto.ProjectMembersDTO;
import com.yellowice.dto.UserDTO;
import com.yellowice.model.Project;
import com.yellowice.model.User;
import com.yellowice.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;


    /**
     * Appelle le service pour ajouter un projet
     * @param project objet projet à ajouter contenant les informations saisies par l'utilisateur
     * @return une réponse http contenant le projet a jouter
     */
    @PostMapping("/add-project")
    public ResponseEntity<Project> saveProject(@RequestBody Project project){
        Project newProject = this.projectService.saveProject(project);
        return ResponseEntity.ok(newProject);
    }


    /**
     * Appelle le service pour récupérer tous les projets d'un utilisateur
     * @return une réponse http contenant une list de projet
     */
    @GetMapping("/allProjects")
    public ResponseEntity<List<Project>> getAllProjects(){
        return ResponseEntity.ok(this.projectService.getAllProjects());
    }

    /**
     * Apelle le service pour récupérer un projet à partir de l'identification
     * @param id l'identification du projet à récupérer
     * @return une réponse http contenant le projet récupéré
     */
    @GetMapping("/get-project/{id}")
    public ResponseEntity<ProjectDTO> getProjectId(@PathVariable Long id){
        ProjectDTO project = projectService.getProjectId(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/get-project/members")
    public ResponseEntity<List<UserDTO>> getUsersFromEachProject(){
        return ResponseEntity.ok(this.projectService.getUsersFromEachProject());
    }

    @DeleteMapping("/delete-project/{projectId}")
    public ResponseEntity<Void> deleteProjectById(@PathVariable Long projectId){
        this.projectService.deleteProjectById(projectId);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("{projectId}/get-members")
//    public ResponseEntity<Map<String, UserDTO>> UsersFromProjectId(@PathVariable Long projectId){
//        return ResponseEntity.ok(this.projectService.getUsersFromProjectId(projectId));
//    }

    @GetMapping("{projectId}/get-members")
    public ResponseEntity<ProjectMembersDTO> UsersFromProjectId(@PathVariable Long projectId){
        return ResponseEntity.ok(this.projectService.getUsersFromProjectId(projectId));
    }

}
