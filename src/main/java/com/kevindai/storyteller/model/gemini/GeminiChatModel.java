package com.kevindai.storyteller.model.gemini;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.ModelOptionsUtils;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class GeminiChatModel implements ChatModel {
    
    private final GeminiApiClient geminiApiClient;
    private final GeminiOptions defaultOptions;
    
    @Override
    public ChatResponse call(Prompt prompt) {
        GeminiOptions runtimeOptions = null;
        if (prompt.getOptions() != null) {
            if (prompt.getOptions() instanceof GeminiOptions) {
                runtimeOptions = (GeminiOptions) prompt.getOptions();
            } else {
                runtimeOptions = defaultOptions;
            }
        }
        
        GeminiOptions finalOptions = runtimeOptions != null ? runtimeOptions : defaultOptions;
        
        // Convert Spring AI messages to Gemini format
        List<GeminiRequest.Content> contents = prompt.getInstructions()
                .stream()
                .map(this::convertMessage)
                .collect(Collectors.toList());
        
        GeminiRequest request = GeminiRequest.builder()
                .contents(contents)
                .generationConfig(GeminiRequest.GenerationConfig.builder()
                        .temperature(finalOptions.getTemperature())
                        .topP(finalOptions.getTopP())
                        .topK(finalOptions.getTopK())
                        .maxOutputTokens(finalOptions.getMaxOutputTokens())
                        .responseModalities(finalOptions.getResponseModalities())
                        .build())
                .build();
        
        String model = finalOptions.getModel() != null ? finalOptions.getModel() : "gemini-2.0-flash-preview-image-generation";
        GeminiResponse response = geminiApiClient.generateContent(request, model);
        
        return convertResponse(response);
    }
    
    private GeminiRequest.Content convertMessage(Message message) {
        String text = message.getText();
        
        GeminiRequest.Part part = GeminiRequest.Part.builder()
                .text(text)
                .build();
        
        return GeminiRequest.Content.builder()
                .parts(List.of(part))
                .build();
    }
    
    private ChatResponse convertResponse(GeminiResponse response) {
        if (CollectionUtils.isEmpty(response.getCandidates())) {
            return new ChatResponse(List.of());
        }
        
        List<Generation> generations = response.getCandidates().stream()
                .map(this::convertCandidate)
                .collect(Collectors.toList());
        
        return new ChatResponse(generations);
    }
    
    private Generation convertCandidate(GeminiResponse.Candidate candidate) {
        if (candidate.getContent() == null || CollectionUtils.isEmpty(candidate.getContent().getParts())) {
            return new Generation(new AssistantMessage(""));
        }
        
        String text = candidate.getContent().getParts().stream()
                .filter(part -> part.getText() != null)
                .map(GeminiResponse.Part::getText)
                .collect(Collectors.joining());
        
        return new Generation(new AssistantMessage(text));
    }
}