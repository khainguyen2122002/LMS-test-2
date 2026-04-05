-- ==========================================
-- 1. THIẾT LẬP BẢNG PROFILES & AUTH
-- ==========================================

-- Tạo bảng profiles (Mở rộng từ auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  username text unique,
  full_name text,
  email text unique not null,
  avatar_url text,
  role text default 'learner' check (role in ('admin', 'instructor', 'learner')) not null,
  department text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Kích hoạt RLS cho profiles
alter table public.profiles enable row level security;

-- Hàm helper kiểm tra quyền Admin (Security Definer)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
end;
$$ language plpgsql security definer;

-- Hàm helper kiểm tra quyền Instructor
create or replace function public.is_instructor()
returns boolean as $$
begin
  return (exists (select 1 from public.profiles where id = auth.uid() and role = 'instructor'));
end;
$$ language plpgsql security definer;

-- Chính sách RLS cho profiles
drop policy if exists "Users can view own profile or admins view all" on public.profiles;
create policy "Users can view own profile or admins view all"
  on public.profiles for select
  using ( auth.uid() = id or is_admin() );

drop policy if exists "Users can update own profile or admins update all" on public.profiles;
create policy "Users can update own profile or admins update all"
  on public.profiles for update
  using ( auth.uid() = id or is_admin() );

-- View công khai để xem danh sách thành viên (chỉ xem tên)
create or replace view public.member_list as
select id, full_name, avatar_url, username
from public.profiles;

grant select on table public.member_list to authenticated;

-- ==========================================
-- 2. THIẾT LẬP BẢNG COURSES (KHÓA HỌC)
-- ==========================================

create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  title text not null,
  description text,
  image_url text,
  price numeric default 0,
  level text default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  instructor_id uuid references public.profiles(id) on delete set null,
  
  constraint title_not_empty check (char_length(title) > 0)
);

-- Kích hoạt RLS cho courses
alter table public.courses enable row level security;

-- Chính sách RLS cho courses
-- 1. Xem: Mọi người dùng đã đăng nhập
drop policy if exists "Anyone authenticated can view courses" on public.courses;
create policy "Anyone authenticated can view courses"
  on public.courses for select
  using ( auth.role() = 'authenticated' );

-- 2. Tạo: Admin hoặc Instructor
drop policy if exists "Admins and instructors can insert courses" on public.courses;
create policy "Admins and instructors can insert courses"
  on public.courses for insert
  with check ( is_admin() or is_instructor() );

-- 3. Sửa: Admin hoặc Chính giảng viên tạo ra khóa học đó
drop policy if exists "Admins or owners can update courses" on public.courses;
create policy "Admins or owners can update courses"
  on public.courses for update
  using ( is_admin() or (auth.uid() = instructor_id and is_instructor()) );

-- 4. Xóa: Chỉ Admin
drop policy if exists "Only admins can delete courses" on public.courses;
create policy "Only admins can delete courses"
  on public.courses for delete
  using ( is_admin() );

-- ==========================================
-- 3. CÁC HÀM TRỢ NĂNG & TRIGGER
-- ==========================================

-- Hàm cập nhật updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger cho profiles
drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Trigger cho courses
drop trigger if exists on_courses_updated on public.courses;
create trigger on_courses_updated
  before update on public.courses
  for each row execute procedure public.handle_updated_at();

-- Trigger xử lý người dùng mới (Google Auth Mapping)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
begin
  base_username := split_part(new.email, '@', 1);

  insert into public.profiles (id, full_name, email, avatar_url, role, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'learner',
    base_username || '_' || substring(gen_random_uuid()::text, 1, 4)
  )
  on conflict (email) do update 
  set 
    id = excluded.id,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- 4. THIẾT LẬP BẢNG ENROLLMENTS (GHI DANH)
-- ==========================================

create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status text default 'active' check (status in ('active', 'pending', 'cancelled')),
  created_at timestamp with time zone default now() not null,
  
  unique(user_id, course_id)
);

alter table public.enrollments enable row level security;

-- Chính sách RLS cho enrollments
drop policy if exists "Users can view their own enrollments" on public.enrollments;
create policy "Users can view their own enrollments"
  on public.enrollments for select
  using ( auth.uid() = user_id or is_admin() );

-- ==========================================
-- 5. THIẾT LẬP BẢNG LESSONS (BÀI HỌC)
-- ==========================================

create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  position integer default 0,
  is_published boolean default false,
  is_free boolean default false,
  video_url text,
  video_id text,
  assignment_type text default 'none' check (assignment_type in ('none', 'multiple_choice', 'essay')),
  assignment_config jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.lessons enable row level security;

-- Chính sách RLS cho lessons
-- 1. Xem: Bài học miễn phí hoặc đã đăng ký khóa học
drop policy if exists "Users can view lessons" on public.lessons;
create policy "Users can view lessons"
  on public.lessons for select
  using (
    is_free = true
    or is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
      and c.instructor_id = auth.uid()
    )
    or exists (
      select 1 from public.enrollments e
      where e.course_id = lessons.course_id
      and e.user_id = auth.uid()
      and e.status = 'active'
    )
  );

-- 2. Quản lý: Admin hoặc Giảng viên của khóa học
drop policy if exists "Management access for lessons" on public.lessons;
create policy "Management access for lessons"
  on public.lessons for all
  using (
    is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
      and c.instructor_id = auth.uid()
    )
  );

-- Trigger cho lessons
drop trigger if exists on_lessons_updated on public.lessons;
create trigger on_lessons_updated
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

-- ==========================================
-- 6. THIẾT LẬP BẢNG PURCHASES (MUA HÀNG)
-- ==========================================

create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  is_fully_completed boolean default false,
  completed_at timestamp with time zone,
  
  unique(user_id, course_id)
);

alter table public.purchases enable row level security;

-- Chính sách RLS cho purchases
drop policy if exists "Users can view their own purchases" on public.purchases;
create policy "Users can view their own purchases"
  on public.purchases for select
  using ( auth.uid() = user_id or is_admin() );

-- ==========================================
-- 7. THIẾT LẬP BẢNG USER_PROGRESS (TIẾN ĐỘ)
-- ==========================================

create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  is_completed boolean default false,
  updated_at timestamp with time zone default now() not null,
  
  unique(user_id, lesson_id)
);

alter table public.user_progress enable row level security;

-- Chính sách RLS cho user_progress
drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress"
  on public.user_progress for select
  using ( auth.uid() = user_id or is_admin() );

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
  on public.user_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can modify own progress"
  on public.user_progress for update
  using ( auth.uid() = user_id );

-- Trigger cho user_progress
drop trigger if exists on_user_progress_updated on public.user_progress;
create trigger on_user_progress_updated
  before update on public.user_progress
  for each row execute procedure public.handle_updated_at();

-- ==========================================
-- 8. THIẾT LẬP BẢNG VERIFICATION_TOKENS
-- ==========================================

create table if not exists public.verification_tokens (
  identifier text not null,
  token text unique not null,
  expires timestamp with time zone not null,
  
  primary key (identifier, token)
);

alter table public.verification_tokens enable row level security;

-- ==========================================
-- 9. THIẾT LẬP BẢNG ASSIGNMENTS (BÀI TẬP)
-- ==========================================

create table if not exists public.assignments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  file_url text,
  file_name text,
  submission_content text,
  status text default 'pending' check (status in ('pending', 'graded', 'rejected')),
  grade numeric,
  feedback text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  
  unique(user_id, lesson_id)
);

alter table public.assignments enable row level security;

-- Chính sách RLS cho assignments
drop policy if exists "Users can view own assignments" on public.assignments;
create policy "Users can view own assignments"
  on public.assignments for select
  using ( auth.uid() = user_id or is_admin() );

drop policy if exists "Users can submit assignments" on public.assignments;
create policy "Users can submit assignments"
  on public.assignments for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Admins can update grades" on public.assignments;
create policy "Admins can update grades"
  on public.assignments for update
  using ( is_admin() );

-- Trigger cho assignments
drop trigger if exists on_assignments_updated on public.assignments;
create trigger on_assignments_updated
  before update on public.assignments
  for each row execute procedure public.handle_updated_at();
