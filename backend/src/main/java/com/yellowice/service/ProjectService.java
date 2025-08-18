package com.yellowice.service;


import com.yellowice.dao.ProjectRepository;
import com.yellowice.dao.TaskRepository;
import com.yellowice.dao.UserRepository;
import com.yellowice.dto.ProjectDTO;
import com.yellowice.dto.ProjectMembersDTO;
import com.yellowice.dto.TaskDTO;
import com.yellowice.dto.UserDTO;
import com.yellowice.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private HistoryService historyService;


    /**
     * Si un utilisateur créer un projet alors il devient le owner de celui-ci
     * Créer et sauvegarder un projet
     * Enregistre l'action dans un historique
     * @param project Le projet a créer
     * @return le projet créé et sauvegardé dans la base de donnée
     */
    public Project saveProject(Project project){
        User actualUser = this.userService.getCurrentUser();
        if(actualUser != null){
            project.setOwner(actualUser);

            List<User> getCollaborators = project.getCollaborators();

            if (getCollaborators != null && !getCollaborators.isEmpty()) {
                List<User> usersForTask = new ArrayList<>();
                for (User users : getCollaborators) {
                    User userToAddForTask = this.userRepository.findByEmail(users.getEmail());
                    if (userToAddForTask == null) {
                        throw new RuntimeException("Utilisateur non trouvé avec l'email : " + userToAddForTask);
                    } if (userToAddForTask.getId().equals(project.getOwner().getId())) {
                        continue;
                    }
                    usersForTask.add(userToAddForTask);
                }
                project.setCollaborators(usersForTask);
            } else {
                project.setCollaborators(null);
            }
        }

        Project savedProject = this.projectRepository.save(project);

        historyService.addProjectAndTaskToHistory(project.getName(), project.getId(), null,
                EnumActions.CREATE,
                this.userService.getCurrentUser().getUsername() + " à créé le projet '" + project.getName() +"'");

        return savedProject;
    }


    /**
     * Récupère tous les projets de l'utilisateur connecté
     * @return les projets de l'utilisateur connecté
     */
    public List<Project> getAllProjects(){
        User actualUser = this.userService.getCurrentUser();
        List<Project> projects = this.projectRepository.findAll();
        List<Project> newListProject = new ArrayList<>();

        for (Project project : projects){
            if(project.getCollaborators().contains(actualUser) || project.getOwner().equals(actualUser)){
                newListProject.add(project);
            }
        }
        return newListProject;

//        if(actualUser != null){
//            return this.projectRepository.findByUser(actualUser);
//        }
//        return Collections.emptyList();
    }


    /**
     * Récupère toutes les tâches de tous les projets de l'utilisateur connecté
     * @return les tâches de tous les projets de l'utilisateur connecté
     */
    public List<Task> getAllTaskFromProject(){
        List<Project> projects = this.getAllProjects();
        List<Task> tasksFromProject = new ArrayList<>();
        User actualUser = this.userService.getCurrentUser();

        for (Project project : projects){
            if(project.getOwner().equals(actualUser) || project.getCollaborators().contains(actualUser)){
                for(Task task : project.getTasks()){
                    tasksFromProject.add(task);
                }
            }
        }
        return tasksFromProject;
    }


    /**
     * Supprime un projet seulement par le owner
     * @param projectId le projet a supprimer
     */
    public void deleteProjectById(Long projectId){
        User actualUser = this.userService.getCurrentUser();
        Project project = this.projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project Not Found"));
        if(project.getOwner().equals(actualUser)){
            this.projectRepository.deleteById(projectId);
        }


    }

    /**
     * Récupère un projet en fonction de l'id
     * @param projectId l'identification du projet à récupérer
     * @return un dto contenant le projet récupéré
     */
    public ProjectDTO getProjectId(Long projectId){
        User actualUser = this.userService.getCurrentUser();
        Project project = this.projectRepository.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet non trouvé"));
        if(project.getOwner().equals(actualUser) ||project.getCollaborators().contains(actualUser)){
            return (new ProjectDTO(project));
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé pour ce projet");
    }


    /**
     * Récupère pour chaque projet de l'utilisateur connecté, tous les utilisateurs appartenant au projet
     * @return un dto contenant la liste  d'utilisateurs des projets
     */
    public List<UserDTO> getUsersFromEachProject(){
        List<Project> projects = this.getAllProjects();
        List<User> users = new ArrayList<>();
        for(Project project : projects){
            if (project.getOwner() == null) {
                throw new RuntimeException("pas de owner");
            }
            users.add(project.getOwner());

            for(User user : project.getCollaborators()){
                if(!users.contains(user)) {
                    users.add(user);
                }

            }
        }
        List<UserDTO> usersDTO = users.stream().map(UserDTO::new).collect(Collectors.toList());
        return usersDTO;
    }


    /**
     * Récupère pour un projet de l'utilisateur connecté, tous les utilisateurs appartenant au projet
     * @param projectId l'identification du projet
     * @return un dto contenant la liste  d'utilisateurs des projets
     */
    public ProjectMembersDTO getUsersFromProjectId(Long projectId){
        ProjectDTO projectToCheck = this.getProjectId(projectId);
        if (projectToCheck.getOwner() == null) {
            throw new RuntimeException("pas de owner");
        }
        return new ProjectMembersDTO(projectToCheck.getOwner(), projectToCheck.getCollaborators());

    }

    /**
     * Récupère toutes les tâches appartenant à l'utilisateur connecté d'un projet en fonction de l'id
     * @param projectId l'identification du projet
     * @return la liste des tâches d'un utilisateur connecté du projet
     */
    public List<Task> getTaskFromProjectForUser(Long projectId){
        User actualUser = this.userService.getCurrentUser();
        List<Task> findTask = this.taskRepository.findByProjectId(projectId);
        List<Task> filteredTasks = new ArrayList<>();

        LocalDate actualDate = LocalDate.now();

        for(Task task : findTask){
            if(task.getCollaborators().contains(actualUser) ||task.getProject().getOwner().equals(actualUser)){
                if(task.getStatus() == null || task.getStatus() != EnumStatus.TERMINEE && task.getEndDate().isBefore(actualDate)){
                    task.setStatus(EnumStatus.EN_RETARD);
                }
                filteredTasks.add(task);
            }

        }
        return filteredTasks;

    }


    /**
     * Récupère toutes les tâches d'un projet en fonction de l'id
     * @param projectId l'identification du projet à récupérer
     * @return un dto contenant la liste des tâches
     */
    public List<TaskDTO> getAllTasksFromProject(Long projectId){
        List<Task> findTask = this.taskRepository.findByProjectId(projectId);
        List<TaskDTO> tasks =  findTask.stream().map(TaskDTO::new ).collect(Collectors.toList());

        return tasks;

    }


    public List<ProjectDTO> searchProjectByName(String projectName){
        List<Project> projectSearch = this.projectRepository.findByNameContainingIgnoreCase(projectName);
        return projectSearch.stream().map(ProjectDTO::new).collect(Collectors.toList());
    }



}
