package com.kevindai.storyteller.repository;

import com.kevindai.storyteller.entity.StoryHistoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryHistoryRepository extends JpaRepository<StoryHistoryEntity, Integer> {
    @Query("""
            select sh from StoryHistoryEntity sh
            where sh.conversationId = :conversationId
            order by sh.id desc
            """)
    Page<StoryHistoryEntity> findByStoryId(Integer storyId, Pageable pageable);
}
