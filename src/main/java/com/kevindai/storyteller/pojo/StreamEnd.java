package com.kevindai.storyteller.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamEnd {
    private UsageInfo usage;
    private String stopReason;

    public StreamEnd(UsageInfo usage) {
        this.usage = usage;
        this.stopReason = "end_turn";
    }
}