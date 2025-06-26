package com.kevindai.storyteller.aiconfig;

import com.kevindai.storyteller.model.gemini.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.image.ImageModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiClientConfig {
    
    @Value("${google.ai.key:}")
    private String googleAiKey;
    
    @Bean
    public GeminiApiClient geminiApiClient() {
        return new GeminiApiClient(googleAiKey);
    }
    
    @Bean(name = "geminiChatClient")
    public ChatClient geminiChatClient() {
        GeminiOptions defaultOptions = GeminiOptions.getDefault();
        GeminiChatModel chatModel = new GeminiChatModel(geminiApiClient(), defaultOptions);
        
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        builder.defaultAdvisors(SimpleLoggerAdvisor.builder().build());
        
        return builder.build();
    }
    
    @Bean(name = "geminiImageModel")
    public ImageModel geminiImageModel() {
        GeminiOptions defaultOptions = GeminiOptions.getImageDefault();
        return new GeminiImageModel(geminiApiClient(), defaultOptions, org.springframework.retry.support.RetryTemplate.builder().build());
    }
    
    @Bean
    public GeminiChatModel geminiChatModel() {
        GeminiOptions defaultOptions = GeminiOptions.getDefault();
        return new GeminiChatModel(geminiApiClient(), defaultOptions);
    }
}