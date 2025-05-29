package com.kevindai.storyteller.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamStart {
    private String conversationId;
    private String model;
    private UsageInfo usage;

    public StreamStart(String conversationId, String model) {
        this.conversationId = conversationId;
        this.model = model;
    }
}