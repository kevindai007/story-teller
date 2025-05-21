package com.kevindai.storyteller.tools;

import com.kevindai.storyteller.entity.UserInfoEntity;
import com.kevindai.storyteller.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@RequiredArgsConstructor
@Slf4j
@Component
public class UserInfoTools {
    private final UserInfoRepository userInfoRepository;

    @Tool(description = "Get current user age")
    UserInfoRecord getCurrentUserInfo(ToolContext toolContext) {
        Integer userId = (Integer) toolContext.getContext().get("id");
        UserInfoEntity userInfoEntity = userInfoRepository.findById(userId).orElse(null);
        if (userInfoEntity == null) {
            return new UserInfoRecord("User not found", 0);
        }

        LocalDate dob = userInfoEntity.getDob();
        int age = LocalDate.now().getYear() - dob.getYear();
        return new UserInfoRecord(userInfoEntity.getUsername(), age);

    }

    public record UserInfoRecord(String name, int age) {
    }
}
