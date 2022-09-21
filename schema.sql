create table
    profiles (
        id uuid default uuid_generate_v4() primary key,
        updated_at timestamp default now(),
        username text,
        avatar_url text,
        website text
    );

create table
    products (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp default now() not null,
        name text not null,
        description text not null,
        image_url text not null,
        seller_id uuid references profiles (id)
    );

create table
    rooms (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp default now() not null,
        name text not null,
        created_by uuid references profiles (id),
        product_id uuid references products (id)
    );

create table
    messages (
        id uuid default uuid_generate_v4() primary key,
        created_at timestamp default now() not null,
        content text not null,
        profile_id uuid references profiles (id),
        room_id uuid default uuid_generate_v4()
    );

create table
    room_participants (
        room_id uuid references rooms (id) primary key,
        created_at timestamp default now() not null,
        profile_id uuid references profiles (id) primary key
    );