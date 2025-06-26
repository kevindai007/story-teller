package com.kevindai.storyteller.model.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiResponse {
    
    @JsonProperty("candidates")
    private List<Candidate> candidates;
    
    @JsonProperty("usageMetadata")
    private UsageMetadata usageMetadata;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Candidate {
        @JsonProperty("content")
        private Content content;
        
        @JsonProperty("finishReason")
        private String finishReason;
        
        @JsonProperty("index")
        private Integer index;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        @JsonProperty("parts")
        private List<Part> parts;
        
        @JsonProperty("role")
        private String role;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        @JsonProperty("text")
        private String text;
        
        @JsonProperty("inlineData")
        private InlineData inlineData;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InlineData {
        @JsonProperty("mimeType")
        private String mimeType;
        
        @JsonProperty("data")
        private String data;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageMetadata {
        @JsonProperty("promptTokenCount")
        private Integer promptTokenCount;
        
        @JsonProperty("candidatesTokenCount")
        private Integer candidatesTokenCount;
        
        @JsonProperty("totalTokenCount")
        private Integer totalTokenCount;
    }
}