package com.yellowice.service;

import com.yellowice.dao.ProjectRepository;
import com.yellowice.dao.TaskRepository;
import com.yellowice.dao.UserRepository;
import com.yellowice.dto.TaskDTO;
import com.yellowice.dto.UserDTO;
import com.yellowice.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    HistoryService historyService;

    /**
     * Créé et sauvegarde dans un projet, une tâche avec toutes les informations nécessaires (collaborateurs si fournis)
     * Ajoute l'action dans un historique du projet dans laquelle elle appartient
     * @param task Tâche a créer
     * @param projectId l'identification du projet auquel la tâche est ajoutée
     * @return la tâche créée et sauvegarder dans la base de donnée
     */

    public Task saveTask(Long projectId, Task task) {
        List<User> getCollaborators = task.getCollaborators();
        Project project = this.projectRepository.findById(projectId).orElseThrow(()-> new RuntimeException("Project not found"));

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
            task.setCollaborators(usersForTask);
            Set<User> updateCollaboratorsProject = new HashSet<>(project.getCollaborators());
            updateCollaboratorsProject.addAll(task.getCollaborators());
            project.setCollaborators(new ArrayList<>(updateCollaboratorsProject));

//            historyService.addToHistory(
//                    EnumActions.ADD,
//                    this.userService.getCurrentUser().getUsername()
//                            + " à ajouté : " + project.getCollaborators()
//                            + "au projet");
        } else {
            task.setCollaborators(null);
        }

        addCollaboratorsToProject(project, task.getCollaborators());

        task.setProject(project);



        Task savedTask = this.taskRepository.save(task);
        historyService.addProjectAndTaskToHistory(project.getName(), project.getId(),task.getTitle(),
                EnumActions.CREATE,
                this.userService.getCurrentUser().getUsername() + " à créé la tâche '" + task.getTitle() +"'");

        return savedTask;
    }


    /**
     * Supprime une tâche par son id
     * et enregistre cette action dans un historique
     * @param id L'identifiant de la tâche à supprimer
     *
     */
    public void deleteTaskById(Long id) {
        Task task = this.taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task Not Found"));
        Project project = task.getProject();
        historyService.addProjectAndTaskToHistory(project.getName(), project.getId(), task.getTitle(),
                EnumActions.DELETE,
                this.userService.getCurrentUser().getUsername() + " à supprimé la tâche '" + task.getTitle() +"'");
        this.taskRepository.deleteById(task.getId());
    }


    /**
     * Modifie toutes les informations d'une tâche
     * et enregistre cette action dans un historique
     * @param updatedTask la tâche modifiée avec les nouvelles informations
     * @param taskId l'identification de la tâche à modifier
     * @return la tâche mise à jour
     */
    public Task updateTask(Task updatedTask, Long taskId) {

        Task findTask = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));
        List<User> userToAssign = new ArrayList<>();

        Project project = findTask.getProject();

        //Methode for normal
//        for (int i = 0; i < updatedTask.getCollaborators().size(); i++) {
//            User theUser = this.userService.getUserByEmail(updatedTask.getCollaborators().get(i).getEmail());
//            System.out.println("xxxxxxxxxxx : " + theUser.getEmail());
//            if (!userToAssign.contains(theUser)) {
//                userToAssign.add(theUser);
//            }
//            System.out.println("IL CONTIENT LE MEME ");
//        }

        for(User users : updatedTask.getCollaborators()){
                User theUser = this.userService.getUserByEmail(users.getEmail());
                if(!userToAssign.contains(theUser)){
                    userToAssign.add(theUser);
                }
            System.out.println("IL CONTIENT LE MEME ");
        }
        findTask.setCollaborators(userToAssign);
        findTask.setTitle(updatedTask.getTitle());
        findTask.setDescription(updatedTask.getDescription());
        findTask.setEndDate(updatedTask.getEndDate());
        findTask.setCreationDate(updatedTask.getCreationDate());
        findTask.setStartDate(updatedTask.getStartDate());
        findTask.setStatus(updatedTask.getStatus());

        addCollaboratorsToProject(project, findTask.getCollaborators());

        historyService.addProjectAndTaskToHistory(project.getName(), project.getId(), findTask.getTitle(),
                EnumActions.UPDATE,
                this.userService.getCurrentUser().getUsername() + " à modifié la tâche '" + findTask.getTitle() +"'");

        return this.taskRepository.save(findTask);


    }


    /**
     * Récupère toutes les informations d'une tâche grâce a l'id
     * @param taskId l'identification de la task pour récupérer ses informations
     * @return un dto contenant les informations personalisées de la tâche
     */
    public TaskDTO getInfoTask(Long taskId){
        Task findTask = this.taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task Not Found"));
        return (new TaskDTO(findTask));
    }


    /**
     * Récupère toutes les tâches de l'utilisateur connecté
     * @return la liste des tâches
     */
    public List<Task> getTask() {
        return this.checkStatusTask();
    }

    /**
     * Vérifie le statut des tâches de l'utilisateur connecté, Si une tâche n'est pas terminée et
     * que sa date de fin est dépassée alors son statut est mis à jour
     * @return la liste des tâches avec le statut à jour
     */
    public List<Task> checkStatusTask(){

        User actualUser = this.userService.getCurrentUser();
        List<Task> findTask = this.taskRepository.findAll();
        ArrayList<Task> userTask = new ArrayList<>();

        LocalDate actualDate = LocalDate.now();

        for(Task task : findTask){
            if(task.getCollaborators().contains(actualUser) || task.getProject().getOwner().equals(actualUser)){
                if(task.getStatus() == null || task.getStatus() != EnumStatus.TERMINEE && task.getEndDate().isBefore(actualDate)){
                    task.setStatus(EnumStatus.EN_RETARD);
                }
                userTask.add(task);
            }

        }
        return userTask;
    }




    /**
     * Compte le nombre de tâches avec le statut "en retard" appartenant à l'utilisateur connecté
     * @return le nombre de tâches en retard
     */
    public int getNumberOfLateTask(){
        int count = 0;
        List<Task> findTask = this.taskRepository.findAll();
        for(Task task : findTask){
            if(task.getStatus().equals(EnumStatus.EN_RETARD)){
                count+=1;
                System.out.println("NOMBRE DE TACHES EN RETARD : " + count);
            }
        }
        return count;
    }

    /**
     * Récupère les tâches à venir ou en retard de l'utilisateur connecté,
     * une tâche est considérée à venir si elle n'est pas terminée et sa date de fin est à l'heure actuelle ou
     * dans le futur
     * @return une liste des tâches à venir ou en retard de l'utilisateur
     */
    public List<Task> getUpcomingTask(){
        LocalDate today = LocalDate.now();
        User actualUser = this.userService.getCurrentUser();
        ArrayList<Task> upcomingTask = new ArrayList<>();
        List<Task> findTask = this.taskRepository.findAll();
        for(Task task: findTask){
            if(task.getCollaborators().contains(actualUser)){
                System.out.println("---------------------" +task.getStartDate().isBefore(today));
                if((task.getStatus() != EnumStatus.TERMINEE && task.getEndDate().isAfter(today.minusDays(1)))
                        || task.getStatus() == EnumStatus.EN_RETARD ){
                    upcomingTask.add(task);
                }
            }

        }
        return upcomingTask;
    }

//    public void addCollaboratorsToProject(Project project, List<UserDTO> collaborators){
//        Set<UserDTO> updateUserList = new HashSet<>(project.getCollaborators().stream().map(UserDTO::new).collect(Collectors.toSet());
//
//        if(!collaborators.isEmpty() && collaborators != null) {
//            for (UserDTO user : collaborators) {
//                if(!user.getId().equals(project.getOwner().getId())){
//                    updateUserList.add(user);
//                }
//            }
//
//        }
//        project.setCollaborators(updateUserList);
//
//    }


    public void addCollaboratorsToProject(Project project, List<User> collaborators){
        Set<User> updateUserList = new HashSet<>(project.getCollaborators());

        if(!collaborators.isEmpty() && collaborators != null) {
            for (User user : collaborators) {
                if(!user.getId().equals(project.getOwner().getId())){
                    updateUserList.add(user);
                }
            }

        }
        project.setCollaborators(new ArrayList<>(updateUserList));

    }



}
