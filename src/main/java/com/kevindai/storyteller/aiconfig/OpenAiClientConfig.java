package com.kevindai.storyteller.aiconfig;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
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

    @Bean(name = "openAiChatClient")
    public ChatClient openAiChatClient() {
        OpenAiApi openAiApi = OpenAiApi.builder().apiKey(apiKey).build();
        OpenAiChatModel chatModel = OpenAiChatModel.builder().openAiApi(openAiApi).build();
        OpenAiEmbeddingModel embeddingModel = new OpenAiEmbeddingModel(openAiApi);
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        builder.defaultAdvisors(SimpleLoggerAdvisor.builder().build());

        return builder.build();
    }

//    @Bean(name = "vertexAiChatClient")
//    public ChatClient chatClient() {
//        VertexAI vertexAI = new VertexAI.Builder()
//                .setProjectId("gen-lang-client-0097599786")
//                .setLocation("us-central1")
//                .build();
//        VertexAiGeminiChatModel chatModel = VertexAiGeminiChatModel.builder().vertexAI(vertexAI).build();
//        ChatClient.Builder builder = ChatClient.builder(chatModel);
//        builder.defaultAdvisors(SimpleLoggerAdvisor.builder().build());
//        return builder.build();
//    }

    @Bean
    public OpenAiEmbeddingModel openAiEmbeddingModel() {
        OpenAiApi openAiApi = OpenAiApi.builder().apiKey(apiKey).build();
        return new OpenAiEmbeddingModel(openAiApi, MetadataMode.EMBED);
    }

}
