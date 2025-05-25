package com.kevindai.storyteller.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "story_histories")
public class StoryHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('story_histories_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;

    @NotNull
    @Column(name = "message", nullable = false)
//    @JdbcTypeCode(SqlTypes.JSON)
    private String message;

    @NotNull
    @Column(name = "message_type", nullable = false)
    private String messageType;

}