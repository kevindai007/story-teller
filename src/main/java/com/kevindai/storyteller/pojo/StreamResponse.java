package com.kevindai.storyteller.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamResponse {
    private String type;
    private String id;
    private Object data;
    private Map<String, Object> metadata;

    public StreamResponse(String type, String id, Object data) {
        this.type = type;
        this.id = id;
        this.data = data;
    }
}