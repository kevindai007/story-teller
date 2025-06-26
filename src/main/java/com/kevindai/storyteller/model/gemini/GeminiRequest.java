package com.kevindai.storyteller.model.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {
    
    @JsonProperty("contents")
    private List<Content> contents;
    
    @JsonProperty("generationConfig")
    private GenerationConfig generationConfig;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        @JsonProperty("parts")
        private List<Part> parts;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        @JsonProperty("text")
        private String text;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        @JsonProperty("responseModalities")
        private List<String> responseModalities;
        
        @JsonProperty("temperature")
        private Double temperature;
        
        @JsonProperty("topP")
        private Double topP;
        
        @JsonProperty("topK")
        private Integer topK;
        
        @JsonProperty("maxOutputTokens")
        private Integer maxOutputTokens;
    }
}