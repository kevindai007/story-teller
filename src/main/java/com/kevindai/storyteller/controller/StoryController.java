package com.kevindai.storyteller.controller;

import com.kevindai.storyteller.pojo.StoryItem;
import com.kevindai.storyteller.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.model.Media;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiEmbeddingOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.net.URL;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
public class StoryController {
    private final ChatClient chatClient;
    private final OpenAiEmbeddingModel openAiEmbeddingModel;
    @Value("${openai.api.key}")
    private String apiKey;

    @GetMapping("/story")
    public String getStory(@RequestParam String input) {
//        ChatClient.CallResponseSpec responseSpec = chatClient.prompt().user(input).call();
//        StoryItem storyItem = chatClient.prompt().user(input).call().entity(StoryItem.class);
        List<StoryItem> storyItem = chatClient.prompt().user(input).call().entity(new ParameterizedTypeReference<>() {
        });
        return storyItem.toString();
    }


    @GetMapping("/stream-story")
    public String getStreamStory(@RequestParam String input) {
        Flux<String> output = chatClient.prompt()
                .user(input)
                .stream()
                .content();
        String content = String.join("", Objects.requireNonNull(output.collectList().block()));
        return content;
    }

    @GetMapping("/image-story")
    public String getImageStory(@RequestParam String input) throws Exception {
        var userMessage = new UserMessage("Explain what do you see on this picture?",
                List.of(new Media(MimeTypeUtils.IMAGE_PNG, new URL("https://docs.spring.io/spring-ai/reference/1.0-SNAPSHOT/_images/multimodal.test.png"))));


        OpenAiChatModel chatModel = new OpenAiChatModel(new OpenAiApi(apiKey));
        ChatResponse response = chatModel.call(new Prompt(List.of(userMessage),
                OpenAiChatOptions.builder().withModel(OpenAiApi.ChatModel.GPT_4_O.getValue()).build()));
        return response.getResults().getFirst().getOutput().getContent();
    }
    @GetMapping("/function-test")
    public String functionTest(@RequestParam String input) {
        String weatherFunction1 = chatClient.prompt().user(input).function("CurrentWeather", "Get the weather in location", new WeatherService()).call().content();
        return weatherFunction1;
    }

    @GetMapping("embedding-test")
    public String embeddingTest(@RequestParam String input) {
//        EmbeddingResponse embeddingResponse = openAiEmbeddingModel.call(
//                new EmbeddingRequest(List.of("Hello World", "World is big and salvation is near"),
//                        OpenAiEmbeddingOptions.builder()
//                                .withModel("Different-Embedding-Model-Deployment-Name")
//                                .build()));
//        return embedding;
        return null;
    }
}
