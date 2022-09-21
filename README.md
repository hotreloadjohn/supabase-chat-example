```
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;
```

## Function

```
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
```

```
NOT NEEDED - replaced by RPC create_rooms
on_room_created(trigger)

insert_creator_into_room trigger

begin
  insert into room_participants(room_id, profile_id)
  values(new.id, auth.uid());

  return new;
end

---

is_room_participant -> bool

select exists (
  select 1
  from room_participants rp
  where rp.room_id = is_room_participant.room_id
  and rp.profile_id = is_room_participant.profile_id
)

==SQL==
alter table messages
add constraint check_content_length
check (
  length(content) <= 500
)
--
select is_room_participant('f74166eb-0abc-4089-9729-534bdf1abf00', '7d01ea10-aebf-4271-b985-0d3f2bf9471b')
--
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

add select and insert ->
bucket_id = 'products'
and auth.role() = 'authenticated

```

https://medium.com/carousell-insider/assembling-robust-web-chat-applications-with-javascript-an-in-depth-guide-9f36685fc1bc

https://ui-avatars.com/

## Carousell Buyer-Seller Chat in 2020

https://www.youtube.com/watch?v=-8XUzP0kUrY

## Tools to export schema & create ER diagram (Unoffical)

https://github.com/zernonia/supabase-schema

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
