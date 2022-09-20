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

![1](https://icecube-eu-408.icedrive.io/thumbnail?p=i5e7Jxh53Fy07OZzJmTgKFi4.X_3IORSQp_wDxpjfPo1_6EI7sfN71at0Xn4XvFF1Os2xlDqB3J6XV7bO58BbCDlyLGz8uHpUKktTHrYuxAg7qmGFnpgIrOu.AMZaq5Z&w=1000&h=1000&m=middle)
![1](https://icecube-eu-408.icedrive.io/thumbnail?p=pyVCDCgH_7y0S_u.ZRmk_nj2y7W6a7FGojRTHX.9b_0opEuQkhRiO36uc3KYmDAPoBoDUsVepq6d5N5rWnkEYSDlyLGz8uHpUKktTHrYuxAg7qmGFnpgIrOu.AMZaq5Z&w=1000&h=1000&m=middle)
![1](https://icecube-eu-408.icedrive.io/thumbnail?p=07HJu0DjYbsJ.cDynce23sv.L2KeZCIG_Mu3mN0k3NtqgrfZ7lxwVFRn.3Q55c7MCibE.SX16Cnz1_rrlm.qV1FSScqz_RS7TiHgY442Wi1bNPi7XtZwaRkWzJxlLcPmegW.qA.wilbxVhrcSb7C9sA7Z5w1mIZpmVtu0w0Pc.Nj7N_bqlmpdPb1f6CZjSLf3dhnWEEf6V3Wxsx33qWudg--&w=1000&h=1000&m=middle)

![1](https://icecube-eu-408.icedrive.io/thumbnail?p=07HJu0DjYbsJ.cDynce23sv.L2KeZCIG_Mu3mN0k3Nsr7x5LRD94566D73vJI4eyCibE.SX16Cnz1_rrlm.qV1FSScqz_RS7TiHgY442Wi0.DaYXAeMiCArIBrs3SOhuCLZMcbTK7Mw1IgwlEh0JW4GXPziPGqBQ9vbdbyr8vTUZO3sxXvNZ7LQSh_QmOTwA3dhnWEEf6V3Wxsx33qWudg--&w=1000&h=1000&m=middle)
![1](https://icecube-eu-408.icedrive.io/thumbnail?p=07HJu0DjYbsJ.cDynce23sv.L2KeZCIG_Mu3mN0k3Nsr7x5LRD94566D73vJI4eyCibE.SX16Cnz1_rrlm.qV1FSScqz_RS7TiHgY442Wi0.DaYXAeMiCArIBrs3SOhuCLZMcbTK7Mw1IgwlEh0JW4GXPziPGqBQ9vbdbyr8vTUZO3sxXvNZ7LQSh_QmOTwA3dhnWEEf6V3Wxsx33qWudg--&w=1000&h=1000&m=middle)
![1](https://icecube-eu-408.icedrive.io/thumbnail?p=07HJu0DjYbsJ.cDynce23sv.L2KeZCIG_Mu3mN0k3Nv3A3Tmahs2Js38_gZGJ1ToCibE.SX16Cnz1_rrlm.qV1FSScqz_RS7TiHgY442Wi3pvz6oxAlbjVYuLhn8FJ1UMze0W_6kHGbYWcxpyswHu9ORCd704v5Iq1wJDXdd4m8TkE_B3FwoKh3gG1iPBxYa3dhnWEEf6V3Wxsx33qWudg--&w=1000&h=1000&m=middle)
![1](https://icecube-eu-408.icedrive.io/thumbnail?p=07HJu0DjYbsJ.cDynce23sv.L2KeZCIG_Mu3mN0k3NunSKSPJhIDogOy1GLsy1U7CibE.SX16Cnz1_rrlm.qV1FSScqz_RS7TiHgY442Wi3._NpDoMzFAm1bemtrGV_chNoLPiIaLb2KnVIw3w1sn07MIYf2c51yBelPGb5v6b1TWIpVcPFVwYblywentGKC3dhnWEEf6V3Wxsx33qWudg--&w=1000&h=1000&m=middle)

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
