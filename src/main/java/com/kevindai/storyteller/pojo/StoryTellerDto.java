package com.kevindai.storyteller.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.kevindai.storyteller.enums.StoryTypeEnum;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class StoryTellerDto {
    @NotBlank(message = "input is required")
    private String input;
    @NotBlank(message = "story_type is required")
    private String storyType;

    @JsonIgnore
    @AssertTrue
    private boolean isValidStoryType() {
        return StoryTypeEnum.fromType(storyType) != null;
    }

}
