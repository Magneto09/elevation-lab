-- =============================================
-- ELEVATION LAB — Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com → SQL Editor)
-- =============================================

-- 1. PROFILES (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  bio TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  creative_goal TEXT DEFAULT '',
  avatar_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. IDEAS
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  tag TEXT DEFAULT 'Creative',
  converted_to_task BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  is_priority BOOLEAN DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SESSIONS (creative timer sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 5. REFLECTIONS
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. POSTS (community feed)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  post_type TEXT DEFAULT 'art',
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. REACTIONS
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('appreciation', 'inspiration', 'curiosity')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- 8. CIRCLES
CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🎨',
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. CIRCLE MEMBERS
CREATE TABLE IF NOT EXISTS circle_members (
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (circle_id, user_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, edit own
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ideas: users see and edit only their own
CREATE POLICY "Users own ideas" ON ideas FOR ALL USING (auth.uid() = user_id);

-- Tasks: users see and edit only their own
CREATE POLICY "Users own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Sessions: users see and edit only their own
CREATE POLICY "Users own sessions" ON sessions FOR ALL USING (auth.uid() = user_id);

-- Reflections: users see and edit only their own
CREATE POLICY "Users own reflections" ON reflections FOR ALL USING (auth.uid() = user_id);

-- Posts: everyone can read, users create their own
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users create own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Reactions: everyone can read, users create their own
CREATE POLICY "Anyone can read reactions" ON reactions FOR SELECT USING (true);
CREATE POLICY "Users create own reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Circles: everyone can read
CREATE POLICY "Anyone can read circles" ON circles FOR SELECT USING (true);

-- Circle members: everyone can read, users join/leave
CREATE POLICY "Anyone can read members" ON circle_members FOR SELECT USING (true);
CREATE POLICY "Users join circles" ON circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave circles" ON circle_members FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SEED DEFAULT CIRCLES
-- =============================================

INSERT INTO circles (name, description, emoji) VALUES
  ('Visual Artists', 'Share and discuss visual art, painting, and illustration', '🎨'),
  ('Writers & Poets', 'Creative writing, poetry, and storytelling', '✍️'),
  ('Musicians', 'Music creation, production, and collaboration', '🎵'),
  ('Designers', 'UI/UX, graphic design, and creative tools', '🖥️'),
  ('Deep Thinkers', 'Philosophy, ideas, and mindful discussions', '🧠'),
  ('Entrepreneurs', 'Business ideas, startups, and creative ventures', '🚀');

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
