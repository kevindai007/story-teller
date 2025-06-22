//package com.kevindai.storyteller.model.google;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.ai.image.ImageModel;
//import org.springframework.ai.image.ImageOptions;
//import org.springframework.ai.image.ImagePrompt;
//import org.springframework.ai.image.ImageResponse;
//import org.springframework.ai.image.observation.ImageModelObservationContext;
//import org.springframework.ai.image.observation.ImageModelObservationDocumentation;
//import org.springframework.ai.model.ModelOptionsUtils;
//import org.springframework.ai.openai.OpenAiImageOptions;
//import org.springframework.ai.openai.api.OpenAiImageApi;
//import org.springframework.ai.openai.api.common.OpenAiApiConstants;
//import org.springframework.http.ResponseEntity;
//
//@Slf4j
//public class GoogleImageModel implements ImageModel {
//    @Override
//    public ImageResponse call(ImagePrompt request) {
//        ImagePrompt requestImagePrompt = buildRequestImagePrompt(imagePrompt);
//
//        OpenAiImageApi.OpenAiImageRequest imageRequest = createRequest(requestImagePrompt);
//
//        var observationContext = ImageModelObservationContext.builder()
//                .imagePrompt(imagePrompt)
//                .provider(OpenAiApiConstants.PROVIDER_NAME)
//                .build();
//
//        return ImageModelObservationDocumentation.IMAGE_MODEL_OPERATION
//                .observation(this.observationConvention, DEFAULT_OBSERVATION_CONVENTION, () -> observationContext,
//                        this.observationRegistry)
//                .observe(() -> {
//                    ResponseEntity<OpenAiImageApi.OpenAiImageResponse> imageResponseEntity = this.retryTemplate
//                            .execute(ctx -> this.openAiImageApi.createImage(imageRequest));
//
//                    ImageResponse imageResponse = convertResponse(imageResponseEntity, imageRequest);
//
//                    observationContext.setResponse(imageResponse);
//
//                    return imageResponse;
//                });
//    }
//
//    private ImagePrompt buildRequestImagePrompt(ImagePrompt imagePrompt) {
//        // Process runtime options
//        OpenAiImageOptions runtimeOptions = null;
//        if (imagePrompt.getOptions() != null) {
//            runtimeOptions = ModelOptionsUtils.copyToTarget(imagePrompt.getOptions(), ImageOptions.class,
//                    OpenAiImageOptions.class);
//        }
//
//        OpenAiImageOptions requestOptions = runtimeOptions == null ? this.defaultOptions : OpenAiImageOptions.builder()
//                // Handle portable image options
//                .model(ModelOptionsUtils.mergeOption(runtimeOptions.getModel(), this.defaultOptions.getModel()))
//                .N(ModelOptionsUtils.mergeOption(runtimeOptions.getN(), this.defaultOptions.getN()))
//                .responseFormat(ModelOptionsUtils.mergeOption(runtimeOptions.getResponseFormat(),
//                        this.defaultOptions.getResponseFormat()))
//                .width(ModelOptionsUtils.mergeOption(runtimeOptions.getWidth(), this.defaultOptions.getWidth()))
//                .height(ModelOptionsUtils.mergeOption(runtimeOptions.getHeight(), this.defaultOptions.getHeight()))
//                .style(ModelOptionsUtils.mergeOption(runtimeOptions.getStyle(), this.defaultOptions.getStyle()))
//                // Handle OpenAI specific image options
//                .quality(ModelOptionsUtils.mergeOption(runtimeOptions.getQuality(), this.defaultOptions.getQuality()))
//                .user(ModelOptionsUtils.mergeOption(runtimeOptions.getUser(), this.defaultOptions.getUser()))
//                .build();
//
//        return new ImagePrompt(imagePrompt.getInstructions(), requestOptions);
//    }
//}
