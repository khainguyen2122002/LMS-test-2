-- ============================================================
-- Migration 001: Add is_published + Create enrollments table
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Thêm cột is_published vào courses (nếu chưa có)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

-- 2. Tạo bảng enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress_percentage integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- 3. Enable RLS cho enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Học viên chỉ thấy enrollment của chính mình
DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
CREATE POLICY "Students can view their own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Policy: Admin và Instructor có thể quản lý toàn bộ enrollments
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;
CREATE POLICY "Admins can manage enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

-- 6. Policy: Học viên có thể update progress của chính mình
DROP POLICY IF EXISTS "Students can update own progress" ON enrollments;
CREATE POLICY "Students can update own progress" ON enrollments
  FOR UPDATE USING (auth.uid() = user_id);
