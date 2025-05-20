package com.kevindai.storyteller.advisor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.AdvisedRequest;
import org.springframework.ai.chat.client.RequestResponseAdvisor;
import org.springframework.ai.chat.model.ChatResponse;
import reactor.core.publisher.Flux;

import java.util.Map;

@Slf4j
public class LoggingAdvisor implements RequestResponseAdvisor {
    @Override
    public AdvisedRequest adviseRequest(AdvisedRequest request, Map<String, Object> context) {
        log.info("Advising request: {}", request);
        return RequestResponseAdvisor.super.adviseRequest(request, context);
    }

    @Override
    public ChatResponse adviseResponse(ChatResponse response, Map<String, Object> context) {
        log.info("Advising normal response: {}", response);
        return RequestResponseAdvisor.super.adviseResponse(response, context);
    }

    @Override
    public Flux<ChatResponse> adviseResponse(Flux<ChatResponse> fluxResponse, Map<String, Object> context) {
        fluxResponse.subscribe(response -> log.info("Advising flux response: {}", response));
        return RequestResponseAdvisor.super.adviseResponse(fluxResponse, context);
    }
}
