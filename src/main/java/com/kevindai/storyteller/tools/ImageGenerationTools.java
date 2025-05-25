package com.kevindai.storyteller.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
public class ImageGenerationTools {
    private final ImageModel imageModel;
    private final ObjectMapper objectMapper;

    @SneakyThrows
    @Tool(description = "generate an image based on the input prompt, returns the image URL")
    ImageGenerationTools.ImageGenerationRecord imageGeneration(@ToolParam(description = "The prompt of image generation") String input, ToolContext toolContext) {
        ImageResponse imageResponse = imageModel.call(new ImagePrompt(input, OpenAiImageOptions.builder()
                .quality("hd")
                .N(1)
                .height(1024)
                .width(1024).build()));
        JsonNode jsonNode = objectMapper.readValue(objectMapper.writeValueAsString(imageResponse.getResult().getMetadata()), JsonNode.class);
        String revisedPrompt = jsonNode.get("revisedPrompt").asText();
        return new ImageGenerationRecord(revisedPrompt, imageResponse.getResult().getOutput().getUrl());
    }

    public record ImageGenerationRecord(String revisedPrompt, String imageUrl) {
    }
}
