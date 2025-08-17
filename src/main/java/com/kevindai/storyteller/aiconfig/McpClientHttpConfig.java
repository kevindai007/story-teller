package com.kevindai.storyteller.aiconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * MCP client HTTP configuration that automatically adds the Authorization header
 */
@Configuration
public class McpClientHttpConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder().filter((ClientRequest req, ExchangeFunction next) -> {
            var attrs = RequestContextHolder.getRequestAttributes();
            if (attrs instanceof ServletRequestAttributes servlet) {
                String auth = servlet.getRequest().getHeader(HttpHeaders.AUTHORIZATION);
                if (StringUtils.hasText(auth)) {
                    ClientRequest withAuth = ClientRequest.from(req)
                            .headers(h -> h.set(HttpHeaders.AUTHORIZATION, auth))
                            .build();
                    return next.exchange(withAuth);
                }
            }
            // If there is no request context or no Authorization header, proceed as usual
            return next.exchange(req);
        });
    }
}

