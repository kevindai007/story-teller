package com.kevindai.storyteller.service;


import com.kevindai.storyteller.entity.StoryHistoryEntity;
import com.kevindai.storyteller.repository.StoryHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Component
public class PostgreChatMemory implements ChatMemory {
    private final StoryHistoryRepository storyHistoryRepository;

    @Override
    public void add(String conversationId, List<Message> messages) {
        List<StoryHistoryEntity> storyHistoryEntities = new ArrayList<>();
        for (Message message : messages) {
            StoryHistoryEntity storyHistoryEntity = new StoryHistoryEntity();
            storyHistoryEntity.setConversationId(conversationId);
            storyHistoryEntity.setMessage(message.getContent());
            storyHistoryEntities.add(storyHistoryEntity);
        }
        try {
            storyHistoryRepository.saveAll(storyHistoryEntities);
        } catch (Exception e) {
            log.error("Error saving messages to PostgreSQL: {}", e.getMessage());
            throw new RuntimeException("Error saving messages to PostgreSQL", e);
        }
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        Pageable pageable = PageRequest.of(0, lastN);
        Page<StoryHistoryEntity> storyHistoryEntities = storyHistoryRepository.findByStoryId(Integer.valueOf(conversationId), pageable);

        List<Message> messages = new ArrayList<>();
        for (StoryHistoryEntity storyHistoryEntity : storyHistoryEntities) {
            MessageType messageType = MessageType.fromValue(storyHistoryEntity.getMessageType());
            switch (messageType) {
                case SYSTEM -> {
                    Message message = new SystemMessage(storyHistoryEntity.getMessage());
                    messages.add(message);
                }
                case USER -> {
                    Message message = new UserMessage(storyHistoryEntity.getMessage());
                    messages.add(message);
                }
                case ASSISTANT -> {
                    Message message = new AssistantMessage(storyHistoryEntity.getMessage());
                    messages.add(message);
                }
            }
        }

        return messages;
    }

    @Override
    public void clear(String conversationId) {

    }
}
