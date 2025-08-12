package com.yellowice.dao;

import com.yellowice.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByProjectIdOrderByTimestampDesc(Long projectId);

}
