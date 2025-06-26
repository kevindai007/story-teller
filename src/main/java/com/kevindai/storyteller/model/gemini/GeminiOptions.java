package com.kevindai.storyteller.model.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.image.ImageOptions;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeminiOptions implements ChatOptions, ImageOptions {
    
    @JsonProperty("model")
    private String model;
    
    @JsonProperty("temperature")
    private Double temperature;
    
    @JsonProperty("topP")
    private Double topP;
    
    @JsonProperty("topK")
    private Integer topK;
    
    @JsonProperty("maxOutputTokens")
    private Integer maxOutputTokens;
    
    @JsonProperty("responseModalities")
    private List<String> responseModalities;
    
    // ImageOptions implementation
    @JsonProperty("n")
    private Integer n;
    
    @JsonProperty("width")
    private Integer width;
    
    @JsonProperty("height")
    private Integer height;
    
    @JsonProperty("responseFormat")
    private String responseFormat;
    
    @JsonProperty("style")
    private String style;
    
    @JsonProperty("frequencyPenalty")
    private Double frequencyPenalty;

    @JsonProperty("maxTokens")
    private Integer maxTokens;

    @JsonProperty("presencePenalty")
    private Double presencePenalty;

    @JsonProperty("stopSequences")
    private List<String> stopSequences;

    // Default values
    public static GeminiOptions getDefault() {
        return GeminiOptions.builder()
                .model("gemini-2.0-flash")
                .temperature(0.7)
                .topP(0.95)
                .topK(40)
                .maxOutputTokens(2048)
                .build();
    }
    
    public static GeminiOptions getImageDefault() {
        return GeminiOptions.builder()
                .model("gemini-2.0-flash-preview-image-generation")
                .temperature(0.7)
                .responseModalities(List.of("TEXT", "IMAGE"))
                .n(1)
                .build();
    }

    @Override
    public Double getFrequencyPenalty() {
        return frequencyPenalty;
    }

    @Override
    public Integer getMaxTokens() {
        return maxTokens;
    }

    @Override
    public Double getPresencePenalty() {
        return presencePenalty;
    }

    @Override
    public List<String> getStopSequences() {
        return stopSequences;
    }

    @Override
    public Double getTemperature() {
        return temperature;
    }
    
    @Override
    public Double getTopP() {
        return topP;
    }

    @Override
    public <T extends ChatOptions> T copy() {
        return null;
    }

    @Override
    public Integer getTopK() {
        return topK;
    }
}