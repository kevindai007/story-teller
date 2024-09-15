package com.kevindai.storyteller.pojo;

import lombok.Data;

@Data
public class StoryItem {
    private String title;
    private String content;

    @Override
    public String toString() {
        return "StoryItem{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
