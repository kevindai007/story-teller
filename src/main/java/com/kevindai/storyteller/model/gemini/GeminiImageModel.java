package com.kevindai.storyteller.model.gemini;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.image.*;
import org.springframework.ai.image.observation.DefaultImageModelObservationConvention;
import org.springframework.ai.image.observation.ImageModelObservationContext;
import org.springframework.ai.image.observation.ImageModelObservationConvention;
import org.springframework.ai.image.observation.ImageModelObservationDocumentation;
import org.springframework.ai.model.ModelOptionsUtils;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import io.micrometer.observation.ObservationRegistry;

import java.util.List;
import java.util.stream.Collectors;

public class GeminiImageModel implements ImageModel {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiImageModel.class);
    private static final ImageModelObservationConvention DEFAULT_OBSERVATION_CONVENTION = new DefaultImageModelObservationConvention();
    private static final String PROVIDER_NAME = "gemini";
    
    private final GeminiOptions defaultOptions;
    private final RetryTemplate retryTemplate;
    private final GeminiApiClient geminiApiClient;
    private final ObservationRegistry observationRegistry;
    private ImageModelObservationConvention observationConvention = DEFAULT_OBSERVATION_CONVENTION;
    
    public GeminiImageModel(GeminiApiClient geminiApiClient) {
        this(geminiApiClient, GeminiOptions.getImageDefault(), RetryTemplate.builder().build());
    }
    
    public GeminiImageModel(GeminiApiClient geminiApiClient, GeminiOptions options, RetryTemplate retryTemplate) {
        this(geminiApiClient, options, retryTemplate, ObservationRegistry.NOOP);
    }
    
    public GeminiImageModel(GeminiApiClient geminiApiClient, GeminiOptions options, RetryTemplate retryTemplate,
                           ObservationRegistry observationRegistry) {
        Assert.notNull(geminiApiClient, "GeminiApiClient must not be null");
        Assert.notNull(options, "options must not be null");
        Assert.notNull(retryTemplate, "retryTemplate must not be null");
        Assert.notNull(observationRegistry, "observationRegistry must not be null");
        this.geminiApiClient = geminiApiClient;
        this.defaultOptions = options;
        this.retryTemplate = retryTemplate;
        this.observationRegistry = observationRegistry;
    }
    
    @Override
    public ImageResponse call(ImagePrompt imagePrompt) {
        ImagePrompt requestImagePrompt = buildRequestImagePrompt(imagePrompt);
        
        var observationContext = ImageModelObservationContext.builder()
            .imagePrompt(imagePrompt)
            .provider(PROVIDER_NAME)
            .build();
        
        return ImageModelObservationDocumentation.IMAGE_MODEL_OPERATION
            .observation(this.observationConvention, DEFAULT_OBSERVATION_CONVENTION, () -> observationContext,
                    this.observationRegistry)
            .observe(() -> {
                GeminiResponse response = this.retryTemplate.execute(ctx -> {
                    GeminiRequest request = createRequest(requestImagePrompt);
                    String model = ((GeminiOptions) requestImagePrompt.getOptions()).getModel();
                    return this.geminiApiClient.generateContent(request, model);
                });
                
                ImageResponse imageResponse = convertResponse(response, requestImagePrompt);
                observationContext.setResponse(imageResponse);
                
                return imageResponse;
            });
    }
    
    private GeminiRequest createRequest(ImagePrompt imagePrompt) {
        String instructions = imagePrompt.getInstructions().get(0).getText();
        GeminiOptions imageOptions = (GeminiOptions) imagePrompt.getOptions();
        
        List<GeminiRequest.Content> contents = List.of(
                GeminiRequest.Content.builder()
                        .parts(List.of(GeminiRequest.Part.builder()
                                .text(instructions)
                                .build()))
                        .build()
        );
        
        return GeminiRequest.builder()
                .contents(contents)
                .generationConfig(GeminiRequest.GenerationConfig.builder()
                        .responseModalities(imageOptions.getResponseModalities())
                        .temperature(imageOptions.getTemperature())
                        .topP(imageOptions.getTopP())
                        .topK(imageOptions.getTopK())
                        .maxOutputTokens(imageOptions.getMaxOutputTokens())
                        .build())
                .build();
    }
    
    private ImageResponse convertResponse(GeminiResponse response, ImagePrompt originalPrompt) {
        if (response == null || CollectionUtils.isEmpty(response.getCandidates())) {
            logger.warn("No image response returned for request: {}", originalPrompt);
            return new ImageResponse(List.of());
        }
        
        List<ImageGeneration> imageGenerationList = response.getCandidates().stream()
                .flatMap(candidate -> {
                    if (candidate.getContent() == null || CollectionUtils.isEmpty(candidate.getContent().getParts())) {
                        return java.util.stream.Stream.empty();
                    }
                    
                    return candidate.getContent().getParts().stream()
                            .filter(part -> part.getInlineData() != null)
                            .map(part -> convertToImageGeneration(part, originalPrompt.getInstructions().get(0).getText()));
                })
                .collect(Collectors.toList());
        
        return new ImageResponse(imageGenerationList);
    }
    
    private ImageGeneration convertToImageGeneration(GeminiResponse.Part part, String originalPrompt) {
        String base64Data = part.getInlineData().getData();
        String mimeType = part.getInlineData().getMimeType();
        
        // Convert base64 to data URL format
        String dataUrl = "data:" + mimeType + ";base64," + base64Data;
        
        Image image = new Image(dataUrl, dataUrl);
        
        GeminiImageGenerationMetadata metadata = new GeminiImageGenerationMetadata(originalPrompt);
        
        return new ImageGeneration(image, metadata);
    }
    
    private ImagePrompt buildRequestImagePrompt(ImagePrompt imagePrompt) {
        GeminiOptions runtimeOptions = null;
        if (imagePrompt.getOptions() != null) {
            if (imagePrompt.getOptions() instanceof GeminiOptions) {
                runtimeOptions = (GeminiOptions) imagePrompt.getOptions();
            } else {
                // Create GeminiOptions from generic ImageOptions
                var options = imagePrompt.getOptions();
                runtimeOptions = GeminiOptions.builder()
                        .model(options.getModel())
                        .n(options.getN())
                        .width(options.getWidth())
                        .height(options.getHeight())
                        .responseFormat(options.getResponseFormat())
                        .style(options.getStyle())
                        .build();
            }
        }
        
        GeminiOptions requestOptions = runtimeOptions == null ? this.defaultOptions : GeminiOptions.builder()
                .model(ModelOptionsUtils.mergeOption(runtimeOptions.getModel(), this.defaultOptions.getModel()))
                .n(ModelOptionsUtils.mergeOption(runtimeOptions.getN(), this.defaultOptions.getN()))
                .responseFormat(ModelOptionsUtils.mergeOption(runtimeOptions.getResponseFormat(),
                        this.defaultOptions.getResponseFormat()))
                .width(ModelOptionsUtils.mergeOption(runtimeOptions.getWidth(), this.defaultOptions.getWidth()))
                .height(ModelOptionsUtils.mergeOption(runtimeOptions.getHeight(), this.defaultOptions.getHeight()))
                .style(ModelOptionsUtils.mergeOption(runtimeOptions.getStyle(), this.defaultOptions.getStyle()))
                .temperature(ModelOptionsUtils.mergeOption(runtimeOptions.getTemperature(), this.defaultOptions.getTemperature()))
                .topP(ModelOptionsUtils.mergeOption(runtimeOptions.getTopP(), this.defaultOptions.getTopP()))
                .topK(ModelOptionsUtils.mergeOption(runtimeOptions.getTopK(), this.defaultOptions.getTopK()))
                .maxOutputTokens(ModelOptionsUtils.mergeOption(runtimeOptions.getMaxOutputTokens(), this.defaultOptions.getMaxOutputTokens()))
                .responseModalities(ModelOptionsUtils.mergeOption(runtimeOptions.getResponseModalities(), this.defaultOptions.getResponseModalities()))
                .build();
        
        return new ImagePrompt(imagePrompt.getInstructions(), requestOptions);
    }
    
    public void setObservationConvention(ImageModelObservationConvention observationConvention) {
        Assert.notNull(observationConvention, "observationConvention cannot be null");
        this.observationConvention = observationConvention;
    }
}