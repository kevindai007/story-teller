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

    @Bean
    public ChatClient openAiChatClient() {
        OpenAiApi openAiApi = OpenAiApi.builder().apiKey(apiKey).build();
        OpenAiChatModel chatModel = OpenAiChatModel.builder().openAiApi(openAiApi).build();
        OpenAiEmbeddingModel embeddingModel = new OpenAiEmbeddingModel(openAiApi);
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        builder.defaultAdvisors(SimpleLoggerAdvisor.builder().build());

        return builder.build();
    }

//    @Bean
//    public ImageModel openAiImageModel() {
//        OpenAiImageApi openAiImageApi = OpenAiImageApi.builder().apiKey(apiKey).build();
//        OpenAiImageOptions imageOptions = OpenAiImageOptions.builder()
//                .quality("hd")
//                .N(4)
//                .height(1024)
//                .width(1024).build();
//        return new OpenAiImageModel(openAiImageApi, imageOptions, RetryTemplate.defaultInstance());
//    }

    @Bean
    public OpenAiEmbeddingModel openAiEmbeddingModel() {
        OpenAiApi openAiApi = OpenAiApi.builder().apiKey(apiKey).build();
        return new OpenAiEmbeddingModel(openAiApi, MetadataMode.EMBED);
    }

}
