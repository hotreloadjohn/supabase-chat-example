![](public/images/logo.png)

# NextJS + Supabase Chat App Demo

A simple chat messaging app demo used in C2C marketplace/ecommerce web application (eg. Carousell).
A "proof of concept" of private chat messaging built using NextJS + Supabase realtime database.

## Features & TODO

- [x] Basic Signup and Login
- [x] Upload single image (post an item listing)
- [x] View items (seller and own)
- [x] Chat with seller only (frontend check only)
- [x] Protected routes
- [ ] [Chat*] New message notifications
- [ ] [Chat] Display chat user last sent messages
- [ ] [Chat] Timestamp and username display to chats
- [ ] [Chat] Emoji selector component
- [ ] [Chat] Attach images
- [ ] [Chat] User online/offline status
- [ ] [Chat] Real-time "user is typing..." indicator
- [ ] [Chat] MANY MORE...

## Installation

```sh
npm install
```

## Usage example

- Sign up
- Login
- Click "Sell" to sell an item
- Go to homepage (Click logo)
- Click any item to view items detail page
- Click "Chat with xxx" to initial a conversation with seller.

## Development setup

1. Create Supabase account
2. Dump schema.sql using Supabase Dashboard using SQL editor
3. Setup functions and triggers (TO BE UPDATED with images)

```
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id,
  new.raw_user_meta_data ->> 'username',
  new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
```

```
is_room_participant -> bool
Add args -> room_id, profile_id

select exists (
  select 1
  from room_participants rp
  where rp.room_id = is_room_participant.room_id
  and rp.profile_id = is_room_participant.profile_id
)
```

```
create or replace function create_room(name text default null, seller uuid default null)
returns rooms as $$
  declare
    v_room rooms;
  begin
    insert into rooms(name)
    values(create_room.name)
    returning * into v_room;

    insert into room_participants(room_id, profile_id)
    values(v_room.id, auth.uid());

    insert into room_participants(room_id, profile_id)
    values(v_room.id, seller);

    return v_room;
  end;
$$ language plpgsql security definer;
```

```
Supabase image bucket: https://supabase.com/docs/guides/storage#allow-public-access-to-a-bucket

add select and insert (with sep line)->
bucket_id = 'products'
and auth.role() = 'authenticated
```

## Release History

- 0.0.1
  - Work in progress

## License

See `LICENSE` for more information.

## Contributing

1. Fork it ([https://github.com/yourname/yourproject/fork](https://github.com/yourname/yourproject/fork))
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
