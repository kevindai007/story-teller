create table public.user_info
(
    id         serial
        primary key,
    dob        date         not null,
    username   varchar(50)  not null,
    password   varchar(255) not null,
    email      varchar(100) not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

alter table public.user_info owner to postgres;



INSERT INTO public.user_info (id, dob, username, password, email, created_at, updated_at) VALUES (1, '2018-05-17', 'kevin', '123', 'kevindaigood@gmail.com', '2025-05-21 18:00:11.096194', '2025-05-21 18:00:11.096194');
