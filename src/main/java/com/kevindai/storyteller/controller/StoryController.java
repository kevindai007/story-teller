package com.kevindai.storyteller.controller;

import com.kevindai.storyteller.entity.UserInfoEntity;
import com.kevindai.storyteller.enums.StoryTypeEnum;
import com.kevindai.storyteller.enums.StreamEventType;
import com.kevindai.storyteller.pojo.*;
import com.kevindai.storyteller.service.PostgreChatMemory;
import com.kevindai.storyteller.tools.ImageGenerationTools;
import com.kevindai.storyteller.tools.UserInfoTools;
import com.kevindai.storyteller.utils.UserHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@RequiredArgsConstructor
@RestController
public class StoryController {
    private final ChatClient chatClient;
    private final OpenAiEmbeddingModel openAiEmbeddingModel;
    @Value("${openai.api.key}")
    private String apiKey;
    private final PostgreChatMemory postgreChatMemory;
    private final UserHelper userHelper;
    private final UserInfoTools userInfoTools;
    private final ImageGenerationTools imageGenerationTools;
    private final ChatMemory chatMemory;
    private final ImageModel imageModel;


    @GetMapping("/story")
    public String getStory(@RequestParam String input) {
//        ChatClient.CallResponseSpec responseSpec = chatClient.prompt().user(input).call();
//        StoryItem storyItem = chatClient.prompt().user(input).call().entity(StoryItem.class);
        List<StoryItem> storyItem = chatClient.prompt().user(input).call().entity(new ParameterizedTypeReference<>() {
        });
        return storyItem.toString();
    }


    @PostMapping(value = "/stream-story", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<StreamResponse>> streamStory(@RequestBody StoryTellerDto storyTellerDto) {
        UserInfoEntity userInfo = userHelper.getUserInfo();
        String streamId = UUID.randomUUID().toString();
        AtomicInteger chunkIndex = new AtomicInteger(0);

        StoryTypeEnum storyTypeEnum = StoryTypeEnum.fromType(storyTellerDto.getStoryType());
        String systemPrompt = storyTypeEnum.getPrompt();

        return Flux.concat(
                // Start event
                Flux.just(createStreamStartEvent(storyTellerDto.getConversationId(), streamId)),
                // Content stream
                chatClient.prompt()
                        .system(systemPrompt)
                        .user(u -> u.text(storyTellerDto.getInput()))
                        .advisors(MessageChatMemoryAdvisor.builder(postgreChatMemory).conversationId(storyTellerDto.getConversationId()).build())
//                        .tools(userInfoTools, imageGenerationTools)
                        .tools(userInfoTools)
                        .toolContext(Map.of("id", userInfo.getId()))
                        .stream().content()
                        .map(chunk -> createContentDeltaEvent(chunk, streamId, chunkIndex.getAndIncrement())),

                // End event
                Flux.just(createStreamEndEvent(streamId))
        );
    }

    @PostMapping("/image-story")
    public ResponseEntity<ImageResponse> getImageStory(@RequestBody StoryTellerDto storyTellerDto) throws Exception {

        ImageResponse imageResponse = imageModel.call(new ImagePrompt(storyTellerDto.getInput(), OpenAiImageOptions.builder()
                .quality("hd")
                .N(1)
                .height(1024)
                .width(1024).build()));
        return ResponseEntity.ok(imageResponse);
    }

    @GetMapping("embedding-test")
    public ResponseEntity<ImageResponse> embeddingTest(@RequestParam String input) {
//        EmbeddingResponse embeddingResponse = openAiEmbeddingModel.call(new EmbeddingRequest("Hello World");
        return null;
    }

//    @GetMapping("/vector-test")
//    public String vectorTest(@RequestParam String input, @RequestParam String messageType) {
//        FilterExpressionBuilder b = new FilterExpressionBuilder();
//        Filter.Expression expression = b.eq("message_type", messageType).build();
//
//        List<Document> results = this.vectorStore.similaritySearch(SearchRequest.builder().query(input).filterExpression(expression).topK(5).build());
//        for (Document result : results) {
//            log.info("Document: {}, Metadata: {}", result.getText(), result.getMetadata());
//        }
//        return "Vector search completed. Check logs for results.";
//    }

    private ServerSentEvent<StreamResponse> createStreamStartEvent(String conversationId, String streamId) {
        StreamStart startData = new StreamStart(conversationId, "spring-ai");
        StreamResponse response = new StreamResponse(StreamEventType.STREAM_START.getEventName(), streamId, startData);
        return ServerSentEvent.<StreamResponse>builder()
                .event(StreamEventType.STREAM_START.getEventName())
                .data(response)
                .build();
    }

    private ServerSentEvent<StreamResponse> createContentDeltaEvent(String chunk, String streamId, int index) {
        ContentDelta deltaData = new ContentDelta(chunk, index);
        StreamResponse response = new StreamResponse(StreamEventType.CONTENT_DELTA.getEventName(), streamId, deltaData);
        return ServerSentEvent.<StreamResponse>builder()
                .event(StreamEventType.CONTENT_DELTA.getEventName())
                .data(response)
                .build();
    }

    private ServerSentEvent<StreamResponse> createStreamEndEvent(String streamId) {
        StreamEnd endData = new StreamEnd(new UsageInfo(0, 0));
        StreamResponse response = new StreamResponse(StreamEventType.STREAM_END.getEventName(), streamId, endData);
        return ServerSentEvent.<StreamResponse>builder()
                .event(StreamEventType.STREAM_END.getEventName())
                .data(response)
                .build();
    }

}
