package com.kevindai.storyteller.aiconfig;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.MetadataMode;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAiClientConfig {
    @Value("${openai.api.key}")
    private String apiKey;

    @Bean
    public ChatClient openAiChatClient() {
        OpenAiChatModel chatModel = new OpenAiChatModel(new OpenAiApi(apiKey));
        OpenAiEmbeddingModel embeddingModel = new OpenAiEmbeddingModel(new OpenAiApi(apiKey));
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        return builder.build();
    }

    @Bean
    public OpenAiEmbeddingModel openAiEmbeddingModel() {
        return new OpenAiEmbeddingModel(new OpenAiApi(apiKey), MetadataMode.EMBED);
    }

}
