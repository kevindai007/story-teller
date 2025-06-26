package com.kevindai.storyteller.model.gemini;

import lombok.Getter;
import org.springframework.ai.image.ImageGenerationMetadata;

import java.util.Objects;

@Getter
public class GeminiImageGenerationMetadata implements ImageGenerationMetadata {

    private String revisedPrompt;

    public GeminiImageGenerationMetadata(String revisedPrompt) {
        this.revisedPrompt = revisedPrompt;
    }

    @Override
    public String toString() {
        return "GeminiImageGenerationMetadata{" + "revisedPrompt='" + this.revisedPrompt + '\'' + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GeminiImageGenerationMetadata that)) {
            return false;
        }
        return Objects.equals(this.revisedPrompt, that.revisedPrompt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.revisedPrompt);
    }
}