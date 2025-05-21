package com.kevindai.storyteller.utils;

import com.kevindai.storyteller.entity.UserInfoEntity;
import com.kevindai.storyteller.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserHelper {
    private final UserInfoRepository userInfoRepository;

    public UserInfoEntity getUserInfo() {
        return userInfoRepository.findAll().getFirst();
    }
}
