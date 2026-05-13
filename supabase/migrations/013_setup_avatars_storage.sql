-- Setup Storage for Avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up RLS for avatars
-- Allow public access to view avatars
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "User can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
create policy "User can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
create policy "User can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
