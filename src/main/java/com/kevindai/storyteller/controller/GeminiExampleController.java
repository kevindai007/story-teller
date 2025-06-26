package com.kevindai.storyteller.controller;

import com.kevindai.storyteller.model.gemini.GeminiChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
@Slf4j
public class GeminiExampleController {
    
    @Qualifier("geminiChatClient")
    private final ChatClient geminiChatClient;
    
    @Qualifier("geminiImageModel")
    private final ImageModel geminiImageModel;
    
    private final GeminiChatModel geminiChatModel;
    
    @PostMapping("/chat")
    public String chat(@RequestBody String message) {
        try {
            return geminiChatClient.prompt()
                    .user(message)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error calling Gemini chat", e);
            return "Error: " + e.getMessage();
        }
    }
    
    @PostMapping("/image")
    public String generateImage(@RequestBody String prompt) {
        try {
            ImageResponse response = geminiImageModel.call(new ImagePrompt(prompt));
            
            if (response.getResults().isEmpty()) {
                return "No image generated";
            }
            
            return response.getResult().getOutput().getUrl();
        } catch (Exception e) {
            log.error("Error generating image with Gemini", e);
            return "Error: " + e.getMessage();
        }
    }
    
    @GetMapping("/test")
    public String test() {
        return "Gemini integration is working!";
    }
}