package com.kevindai.storyteller.enums;

public enum StreamEventType {
    STREAM_START("stream_start"),
    CONTENT_DELTA("content_delta"),
    TOOL_USE_START("tool_use_start"),
    TOOL_USE_DELTA("tool_use_delta"),
    TOOL_USE_END("tool_use_end"),
    STREAM_END("stream_end"),
    ERROR("error");

    private final String eventName;

    StreamEventType(String eventName) {
        this.eventName = eventName;
    }

    public String getEventName() {
        return eventName;
    }
}