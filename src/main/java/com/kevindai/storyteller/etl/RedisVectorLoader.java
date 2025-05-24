package com.kevindai.storyteller.etl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kevindai.storyteller.entity.StoryHistoryEntity;
import com.kevindai.storyteller.repository.StoryHistoryRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Component
public class RedisVectorLoader {
    private final VectorStore vectorStore;
    private final StoryHistoryRepository storyHistoryRepository;
    private final ObjectMapper objectMapper;

    @SneakyThrows
    @PostConstruct
    public void loadVectors() {
        //todo there is an issue
        SearchRequest build = SearchRequest.builder().query(" ").topK(500).build();
        List<Document> documents1 = vectorStore.similaritySearch(build);
        vectorStore.delete(documents1.stream().map(Document::getId).toList());
        List<StoryHistoryEntity> all = storyHistoryRepository.findAll();

        List<Document> documents = new ArrayList<>();
        for (StoryHistoryEntity storyHistoryEntity : all) {
            Document textDoc = Document.builder()
                    .text(objectMapper.writeValueAsString(storyHistoryEntity.getMessage()))
                    .metadata("message_type", storyHistoryEntity.getMessageType())
                    .build();
            documents.add(textDoc);
        }

        vectorStore.add(documents);

    }
}
