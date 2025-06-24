create table public.story_histories
(
    id              serial
        primary key,
    conversation_id varchar(255) not null,
    message         varchar      not null,
    message_type    varchar(16)  not null
);

alter table public.story_histories
    owner to postgres;

