package com.yellowice.controller;


import com.yellowice.dto.TaskDTO;
import com.yellowice.model.Task;
import com.yellowice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;


    /**
     * Appelle le service pour ajouter une nouvelle tâche
     * @param task la tâche à ajouter
     * @return une réponse http contenant la tâche créée
     */
    @PostMapping("/{projectId}/add-task")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long projectId , @RequestBody Task task){
        Task newTask = this.taskService.saveTask(projectId,task);
        return ResponseEntity.ok(newTask);
    }

    /**
     * Appelle le service pour supprimer une tâche grâce à son id
     * @param id identification de la tâche
     * @return une réponse http avec le statut 204 si succès
     */
    @DeleteMapping("/delete-task/{id}")
    public ResponseEntity<Void> deleteTaskById(@PathVariable Long id){
        this.taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Appelle le service pour modifier une tâche à l'aide de son id
     * @param task la tâche modifiée avec les nouvelles informations
     * @param id l'identification de la tâche
     * @return une réponse http contenant la tâche mis à jour
     */
    @PutMapping("/update-task/{id}")
    public ResponseEntity<Task> updateTask(@RequestBody Task task, @PathVariable Long id){
        return ResponseEntity.ok(this.taskService.updateTask(task, id));
    }

    /**
     * Appelle le service pour récupèrer toutes les tâches
     * @return une réponse http contenant un dto avec les informations personnalisées
     */
    @GetMapping("/task")
    public ResponseEntity<List<TaskDTO>> getTasks(){
        List<TaskDTO> tasks = taskService.getTask()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }


    /**
     * Appelle le service pour récupèrer les informations d'une tâche grâce à son id
     * @param id identification de la tâche a récuperer
     * @return une réponse http avec un dto contenant les informations personnalisées
     */
    @GetMapping("/get-task/{id}")
    public ResponseEntity<TaskDTO> getTaskInfo(@PathVariable Long id){
        TaskDTO task = taskService.getInfoTask(id);
        return ResponseEntity.ok(task);
    }


    /**
     * Appelle le service pour récupèrer le nombre de tâche en retard
     * @return une réponse http avec le nombre de tâche en retard
     */
    @GetMapping("/numberLateTask")
    public ResponseEntity<Integer> getNumberLateTasks(){
        return ResponseEntity.ok(this.taskService.getNumberOfLateTask());
    }


    /**
     * Appelle le service pour récupérer toutes les tâches à venir
     * @return une réponse http avec un dto contenant une liste de tâches
     */
    @GetMapping("/upcoming-task")
    public ResponseEntity<List<TaskDTO>> getUpcomingTask(){
        List<TaskDTO> tasks = this.taskService.getUpcomingTask()
                .stream()
                .map(TaskDTO::new)
                .toList();
        return ResponseEntity.ok(tasks);
    }





}
