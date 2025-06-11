package com.kevindai.storyteller.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
public class ImageGenerationTools {
    private final ImageModel imageModel;
    private final ObjectMapper objectMapper;

//    public static final String monsterImageGenerationPrompt = """
//            Create a collectible monster trading card illustration in the style of Pokémon TCG, featuring the monster %s.
//
//            The card should have a unified, metallic-themed border, rounded corners, and a glowing, energy-infused background with a gradient from dark blue to silver, giving a high-tech, mechanical atmosphere. The monster stands in the center in a dynamic full-body pose, slightly facing the viewer. The art should be vibrant, bold, and highly detailed, with a subtle 3D effect.↳
//
//            {description: %s, %s, %s, %s}
//
//            Add a faint gear or circuit pattern in the background for consistency across cards.
//            No text or stats, only the illustration. The overall card should look like part of a collectible trading card set.
//            """;

    public static final String monsterImageGenerationPrompt = """
            Create a digital trading card in the style of modern anime monster card games.↳
            
            Main subject: %s
            
            Color scheme: %s
            
            Background: %s
            
            Card frame: Thick silver metallic border, with gear and circuit patterns in the corners.
            
            Header: Fantasy/sci-fi monster icon and name area (leave blank or fantasy glyphs).
            
            Footer: Stat/info area, stylized as unreadable glyphs.
            
            Style: Modern anime/cyber-fantasy, clean, sharp, dynamic, no real text except for fantasy glyphs. Looks like a card from a collectible digital monster card game.
            """;

    @SneakyThrows
    @Tool(description = "generate a monster image based on the input prompt, returns the image URL")
//    ImageGenerationTools.ImageGenerationRecord imageGeneration(@ToolParam(description = "The prompt of image generation") MonsterDescription monsterDescription, ToolContext toolContext) {
    ImageGenerationTools.ImageGenerationRecord imageGeneration(MonsterDescription monsterDescription, ToolContext toolContext) {
        ImageResponse imageResponse = imageModel.call(new ImagePrompt(monsterDescription.toPrompt(), OpenAiImageOptions.builder()
                .quality("hd")
                .N(1)
                .height(1024)
                .width(1024).build()));
        JsonNode jsonNode = objectMapper.readValue(objectMapper.writeValueAsString(imageResponse.getResult().getMetadata()), JsonNode.class);
        String revisedPrompt = jsonNode.get("revisedPrompt").asText();
        return new ImageGenerationRecord(revisedPrompt, imageResponse.getResult().getOutput().getUrl());
    }

    public record ImageGenerationRecord(String revisedPrompt, String imageUrl) {
    }

    //    public record MonsterDescription(String name, String appearance, String size, String colors,
//                                     String specialFeatures) {
//        public String toPrompt() {
//            return String.format(monsterImageGenerationPrompt, name, appearance, size, colors, specialFeatures);
//        }
//
//    }
    public record MonsterDescription(
            @ToolParam(description = "The main object of this monster,eg:A small, round-bodied mechanical monster called \"Iron Fury\" (infant form), made of silver and red metal, with glowing red eyes and short claws. The pose is dynamic, showing energy and potential.") String mainObject,
            @ToolParam(description = "The color schema of this monster, eg:Silver, metallic red, and bright blue accents. High contrast, glowing highlights.") String colorSchema,
            @ToolParam(description = "The background of the monster in this image, eg:A swirling blue energy aura with metallic spark effects behind the monster, giving a sense of power and movement. ") String background) {
        public String toPrompt() {
            return String.format(monsterImageGenerationPrompt,
                    mainObject,
                    colorSchema,
                    background);
        }

    }
}
