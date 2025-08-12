package com.yellowice.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name="task")
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "title")
    private String title;

    @Column(name = "startDate")
    private LocalDate startDate;

    @Column(name="endDate")
    private LocalDate endDate;

    @Column(name="description")
    private String description;

    @Column(name="creationDate")
    private LocalDate creationDate;

    @Column(name="status")
    private EnumStatus status;

    @ManyToMany
    @JoinTable(
            name="task_users",
            joinColumns = @JoinColumn(name="task_id"),
            inverseJoinColumns = @JoinColumn(name = "users_id")
    )//table prioritaire
    private List<User> collaborators = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference("project-tasks")
    private Project project;

}
