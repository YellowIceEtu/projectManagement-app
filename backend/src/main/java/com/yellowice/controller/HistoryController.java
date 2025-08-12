package com.yellowice.controller;

import com.yellowice.dto.HistoryDTO;
import com.yellowice.model.History;
import com.yellowice.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {


    @Autowired
    HistoryService historyService;


    /**
     * Récupère l'historique du projet choisit en fonction de son id
     * @param projectId l'identification du projet
     * @return une liste d'un dto contenant l'historique du projet choisit
     */
    @GetMapping("/project/{projectId}")
    public List<HistoryDTO> getProjectHistory(@PathVariable Long projectId){
        return this.historyService.getHistoryProject(projectId);
    }


}
