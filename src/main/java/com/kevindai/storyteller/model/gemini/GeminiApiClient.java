package com.kevindai.storyteller.model.gemini;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@Slf4j
public class GeminiApiClient {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    
    public GeminiApiClient(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public GeminiResponse generateContent(GeminiRequest request, String model) {
        String url = String.format("%s/%s:generateContent?key=%s", BASE_URL, model, apiKey);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<GeminiResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GeminiResponse.class);
            
            log.debug("Gemini API response: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            throw new RuntimeException("Failed to call Gemini API", e);
        }
    }
}