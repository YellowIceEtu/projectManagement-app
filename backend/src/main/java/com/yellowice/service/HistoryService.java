package com.yellowice.service;

import com.yellowice.dao.HistoryRepository;
import com.yellowice.dto.HistoryDTO;
import com.yellowice.dto.ProjectDTO;
import com.yellowice.dto.UserDTO;
import com.yellowice.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.ListResourceBundle;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    @Autowired
    HistoryRepository historyRepository;

    @Autowired
    UserService userService;


    /**
     * Méthode permettant d'ajouter chaque action fait par l'utilisateur sur un projet et tâche dans un historique
     * @param projectName le nom du projet qui doit être ajoutée dans l'historique
     * @param projectId l'identification du projet
     * @param taskTitle le titre de la tâche qui doit être ajoutée dans l'historique
     * @param actions l'action fait par l'utilisateur
     * @param description description de l'action de l'utilisateur
     */
    public void addProjectAndTaskToHistory(String projectName, Long projectId, String taskTitle,EnumActions actions, String description){
        User user = userService.getCurrentUser();
        History history = new History();
        history.setActions(actions);
        history.setDescription(description);
        history.setTimestamp(LocalDateTime.now());
        history.setPerformedBy(user);
        history.setProjectName(projectName);
        history.setTaskTitle(taskTitle);
        history.setProjectId(projectId);
//        if(project.getTasks() != null){
//            history.setTaskTitle(taskTitle);
//
//        }else{
//            history.setTaskTitle(null);
//        }

        this.historyRepository.save(history);
    }


    /**
     * Récupère l'historique d'un projet en fonction de l'id
     * @param projectId l'identification du projet
     * @return une liste de dto contenant l'historique du projet choisit
     */
    public List<HistoryDTO> getHistoryProject(Long projectId){
        List<History> historyList = this.historyRepository.findByProjectIdOrderByTimestampDesc(projectId);
        List<HistoryDTO> historyDTOList = historyList.stream().map(HistoryDTO::new).toList();
        return historyDTOList;
    }


}
