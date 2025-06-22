//package com.kevindai.storyteller.model.google;
//
//import com.fasterxml.jackson.annotation.JsonInclude;
//import com.fasterxml.jackson.annotation.JsonProperty;
//import lombok.Builder;
//import org.springframework.ai.image.ImageOptions;
//import org.springframework.ai.openai.OpenAiImageOptions;
//
//
////cat << EOF > request.json
////{
////    "endpoint": "projects/gen-lang-client-0097599786/locations/us-central1/publishers/google/models/imagen-4.0-ultra-generate-exp-05-20",
////        "instances": [
////    {
////        "prompt": "Create a digital trading card in the style of modern anime monster card games.↳\\n\\nMain subject: A majestic creature named 'Prism Serpent', with a long, sinuous body covered in reflective scales that refract light into rainbow patterns. It has large, expressive eyes and delicate, feather-like appendages along its spine.\\n\\nColor scheme: Iridescent scales with a spectrum of colors, shimmering and changing with each movement.\\n\\nBackground: A swirling rainbow energy aura, casting vibrant hues across a mystical forest setting.\\n\\nCard frame: Thick silver metallic border, with gear and circuit patterns in the corners.\\n\\nHeader: Fantasy/sci-fi monster icon and name area (leave blank or fantasy glyphs).\\n\\nFooter: Stat/info area, stylized as unreadable glyphs.\\n\\nStyle: Modern anime/cyber-fantasy, clean, sharp, dynamic, no real text except for fantasy glyphs. Looks like a card from a collectible digital monster card game.\\n",
////    }
////    ],
////    "parameters": {
////    "aspectRatio": "9:16",
////            "sampleCount": 1,
////            "negativePrompt": "",
////            "enhancePrompt": false,
////            "personGeneration": "",
////            "safetySetting": "",
////            "addWatermark": true,
////            "includeRaiReason": true,
////            "language": "auto"
////}
////}
////EOF
////
////        PROJECT_ID="gen-lang-client-0097599786"
////LOCATION_ID="us-central1"
////API_ENDPOINT="us-central1-aiplatform.googleapis.com"
////MODEL_ID="imagen-4.0-ultra-generate-exp-05-20"
////
////curl \
////        -X POST \
////        -H "Content-Type: application/json" \
////        -H "Authorization: Bearer $(gcloud auth print-access-token)" \
////        "https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:predict" -d '@request.json'
//@Builder
//@JsonInclude(JsonInclude.Include.NON_NULL)
//public class GoogleAiImageOptions implements ImageOptions {
//
//    /**
//     * The number of images to generate. Must be between 1 and 4
//     * is supported.
//     */
//    @JsonProperty("n")
//    private Integer n;
//
//    /**
//     * The model to use for image generation.
//     */
//    @JsonProperty("model")
//    private String model;
//
//    /**
//     * The width of the generated images. Must be one of 256, 512, or 1024 for dall-e-2.
//     * This property is interconnected with the 'size' property - setting both width and
//     * height will automatically compute and set the size in "widthxheight" format.
//     * Conversely, setting a valid size string will parse and set the individual width and
//     * height values.
//     */
//    @JsonProperty("size_width")
//    private Integer width;
//
//    /**
//     * The height of the generated images. Must be one of 256, 512, or 1024 for dall-e-2.
//     * This property is interconnected with the 'size' property - setting both width and
//     * height will automatically compute and set the size in "widthxheight" format.
//     * Conversely, setting a valid size string will parse and set the individual width and
//     * height values.
//     */
//    @JsonProperty("size_height")
//    private Integer height;
//
//    /**
//     * The quality of the image that will be generated. hd creates images with finer
//     * details and greater consistency across the image. This param is only supported for
//     * dall-e-3.
//     */
//    @JsonProperty("quality")
//    private String quality;
//
//    /**
//     * The format in which the generated images are returned. Must be one of url or
//     * b64_json.
//     */
//    @JsonProperty("response_format")
//    private String responseFormat;
//
//    /**
//     * The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024 for
//     * dall-e-2. Must be one of 1024x1024, 1792x1024, or 1024x1792 for dall-e-3 models.
//     * This property is automatically computed when both width and height are set,
//     * following the format "widthxheight". When setting this property directly, it must
//     * follow the format "WxH" where W and H are valid integers. Invalid formats will
//     * result in null width and height values.
//     */
//    @JsonProperty("size")
//    private String size;
//
//    /**
//     * The style of the generated images. Must be one of vivid or natural. Vivid causes
//     * the model to lean towards generating hyper-real and dramatic images. Natural causes
//     * the model to produce more natural, less hyper-real looking images. This param is
//     * only supported for dall-e-3.
//     */
//    @JsonProperty("style")
//    private String style;
//
//    /**
//     * A unique identifier representing your end-user, which can help OpenAI to monitor
//     * and detect abuse.
//     */
//    @JsonProperty("user")
//    private String user;
//
//
//    @Override
//    public Integer getN() {
//        return 0;
//    }
//
//    @Override
//    public String getModel() {
//        return "";
//    }
//
//    @Override
//    public Integer getWidth() {
//        return 0;
//    }
//
//    @Override
//    public Integer getHeight() {
//        return 0;
//    }
//
//    @Override
//    public String getResponseFormat() {
//        return "";
//    }
//
//    @Override
//    public String getStyle() {
//        return "";
//    }
//}
