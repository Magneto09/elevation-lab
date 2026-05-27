"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ===== AUTH HOOK =====
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}

// ===== PROFILE HOOK =====
export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    supabase.from("profiles").select("*").eq("id", userId).single()
      .then(({ data }) => setProfile(data));
  }, [userId]);

  const updateProfile = async (updates: any) => {
    if (!userId) return;
    const { data, error } = await supabase.from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId).select().single();
    if (data) setProfile(data);
    return { data, error };
  };

  return { profile, updateProfile };
}

// ===== IDEAS HOOK =====
export function useIdeas(userId: string | undefined) {
  const [ideas, setIdeas] = useState<any[]>([]);

  const fetchIdeas = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("ideas")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setIdeas(data);
  }, [userId]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  const addIdea = async (content: string, tag: string = "Creative") => {
    if (!userId) return;
    const { data, error } = await supabase.from("ideas")
      .insert({ user_id: userId, content, tag })
      .select().single();
    if (data) setIdeas(prev => [data, ...prev]);
    return { data, error };
  };

  const deleteIdea = async (id: string) => {
    await supabase.from("ideas").delete().eq("id", id);
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return { ideas, addIdea, deleteIdea, refreshIdeas: fetchIdeas };
}

// ===== TASKS HOOK =====
export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("tasks")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setTasks(data);
  }, [userId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (title: string, isPriority: boolean = false) => {
    if (!userId) return;
    const { data, error } = await supabase.from("tasks")
      .insert({ user_id: userId, title, is_priority: isPriority })
      .select().single();
    if (data) setTasks(prev => [data, ...prev]);
    return { data, error };
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === "done" ? "pending" : "done";
    const { data } = await supabase.from("tasks")
      .update({ status: newStatus }).eq("id", id).select().single();
    if (data) setTasks(prev => prev.map(t => t.id === id ? data : t));
  };

  return { tasks, addTask, toggleTask, refreshTasks: fetchTasks };
}

// ===== REFLECTIONS HOOK =====
export function useReflections(userId: string | undefined) {
  const [reflections, setReflections] = useState<any[]>([]);

  const fetchReflections = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("reflections")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setReflections(data);
  }, [userId]);

  useEffect(() => { fetchReflections(); }, [fetchReflections]);

  const addReflection = async (content: string, prompt: string) => {
    if (!userId) return;
    const { data, error } = await supabase.from("reflections")
      .insert({ user_id: userId, content, prompt })
      .select().single();
    if (data) setReflections(prev => [data, ...prev]);
    return { data, error };
  };

  return { reflections, addReflection, refreshReflections: fetchReflections };
}

// ===== SESSIONS HOOK =====
export function useSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from("sessions")
      .select("*").eq("user_id", userId)
      .order("completed_at", { ascending: false });
    if (data) setSessions(data);
  }, [userId]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const logSession = async (sessionType: string, durationMinutes: number, notes: string) => {
    if (!userId) return;
    const { data, error } = await supabase.from("sessions")
      .insert({ user_id: userId, session_type: sessionType, duration_minutes: durationMinutes, notes })
      .select().single();
    if (data) setSessions(prev => [data, ...prev]);
    return { data, error };
  };

  return { sessions, logSession, refreshSessions: fetchSessions };
}

// ===== CIRCLES HOOK =====
export function useCircles(userId: string | undefined) {
  const [circles, setCircles] = useState<any[]>([]);
  const [myCircles, setMyCircles] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("circles").select("*").order("member_count", { ascending: false })
      .then(({ data }) => { if (data) setCircles(data); });
    
    if (userId) {
      supabase.from("circle_members").select("circle_id").eq("user_id", userId)
        .then(({ data }) => { if (data) setMyCircles(data.map(d => d.circle_id)); });
    }
  }, [userId]);

  const joinCircle = async (circleId: string) => {
    if (!userId) return;
    await supabase.from("circle_members").insert({ circle_id: circleId, user_id: userId });
    setMyCircles(prev => [...prev, circleId]);
  };

  const leaveCircle = async (circleId: string) => {
    if (!userId) return;
    await supabase.from("circle_members").delete()
      .eq("circle_id", circleId).eq("user_id", userId);
    setMyCircles(prev => prev.filter(id => id !== circleId));
  };

  return { circles, myCircles, joinCircle, leaveCircle };
}
