import React, { createContext, useContext, useState, useEffect } from 'react';
import { sb } from '../supabase';

const AppContext = createContext();

const STAR_MAP = { urgent: 5, high: 3, medium: 2, low: 1 };
const NUDGES = [
  "Every line of code you write is one step closer to something real. I see you grinding 🔥",
  "Your consistency is your superpower. Keep pushing, I'm watching you grow 💪",
  "Even if it's messy today, it's progress. Clean code comes after working code. Go! ✨",
  "I believe in you more than you know. Check off that next task 💛",
  "You're building something real. That's more than most people ever do 🚀",
  "Small wins today = big wins next week. Keep the streak going! 🔥",
  "Stuck? Break it into smaller pieces. You've solved harder things before 🧩",
  "Your future self will thank you for the work you put in today 🌸",
  "One commit at a time. One task at a time. You've got this 💻",
  "I'm proud of how far you've come. Don't stop now 💜"
];

// DB converters (camelCase JS <-> snake_case DB)
export function todoToDb(t) {
  return {
    id: t.id, text: t.text, description: t.description || '', cat: t.cat, priority: t.priority, status: t.status,
    added_by: t.addedBy, assign_to: t.assignTo, him_done: t.himDone, her_done: t.herDone,
    due_date: t.dueDate, created_at: t.createdAt, updated_at: t.updatedAt
  };
}

export function todoFromDb(t) {
  return {
    id: t.id, text: t.text, description: t.description || '', cat: t.cat, priority: t.priority, status: t.status,
    addedBy: t.added_by, assignTo: t.assign_to, himDone: t.him_done, herDone: t.her_done,
    dueDate: t.due_date || '', createdAt: t.created_at, updatedAt: t.updated_at
  };
}

export function noteToDb(n) {
  return { id: n.id, text: n.text, from_role: n.from, from_name: n.fromName, type: n.type, ts: n.ts, reply_to: n.replyTo || null };
}

export function noteFromDb(n) {
  return { id: n.id, text: n.text, from: n.from_role, fromName: n.from_name, type: n.type, ts: n.ts, replyTo: n.reply_to || null };
}

export function redeemToDb(r) {
  return { id: r.id, message: r.message, phone: r.phone, status: r.status, ts: r.ts, responded_at: r.respondedAt || null };
}

export function redeemFromDb(r) {
  return { id: r.id, message: r.message, phone: r.phone, status: r.status, ts: r.ts, respondedAt: r.responded_at };
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [redeems, setRedeems] = useState([]);
  const [profilesMap, setProfilesMap] = useState({
    him: { name: 'Sanjay', emoji: '👦' },
    her: { name: 'My Love', emoji: '👧' }
  });

  // Filters state
  const [flt, setFlt] = useState('all');
  const [catFlt, setCatFlt] = useState('');
  const [priFlt, setPriFlt] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [queryTodoId, setQueryTodoId] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '' });
  const [toastTimeoutId, setToastTimeoutId] = useState(null);

  // Confirm dialog state
  const [confirm, setConfirm] = useState({ show: false, title: '', message: '', resolve: null });

  // Custom utilities
  const showToast = (message) => {
    setToast({ show: true, message });
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    const id = setTimeout(() => setToast({ show: false, message: '' }), 2200);
    setToastTimeoutId(id);
  };

  const showConfirm = (message, title = "Warning! ⚠️") => {
    return new Promise((resolve) => {
      setConfirm({
        show: true,
        title,
        message,
        resolve: (val) => {
          setConfirm({ show: false, title: '', message: '', resolve: null });
          resolve(val);
        }
      });
    });
  };

  // Helper logic for uid and timestamp
  const uid = () => Math.random().toString(36).slice(2, 10);
  const now = () => Date.now();

  // Load session on startup
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: authSession } } = await sb.auth.getSession();
      if (authSession) {
        try {
          await setupSession(authSession.user);
        } catch (e) {
          console.error('Session restore failed:', e);
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const setupSession = async (user) => {
    const { data: profile, error } = await sb.from('profiles').select('*').eq('email', user.email).single();
    if (error || !profile) throw new Error('Not authorized. Profile not found.');
    const newSession = { user_id: user.id, email: user.email, role: profile.role, name: profile.name, emoji: profile.emoji };
    setSession(newSession);
    return newSession;
  };

  // Fetch functions
  const loadProfiles = async () => {
    const { data, error } = await sb.from('profiles').select('*');
    if (error) { console.error('loadProfiles:', error); return; }
    if (data) {
      const newProfilesMap = {};
      data.forEach(p => {
        newProfilesMap[p.role] = { name: p.name, emoji: p.emoji };
      });
      setProfilesMap(newProfilesMap);
    }
  };

  const loadTodos = async () => {
    const { data, error } = await sb.from('todos').select('*');
    if (error) { console.error('loadTodos:', error); return; }
    setTodos((data || []).map(todoFromDb));
  };

  const loadNotes = async () => {
    const { data, error } = await sb.from('notes').select('*');
    if (error) { console.error('loadNotes:', error); return; }
    const loadedNotes = (data || []).map(noteFromDb);
    loadedNotes.sort((a, b) => b.ts - a.ts);
    setNotes(loadedNotes);
  };

  const loadRedeems = async () => {
    const { data, error } = await sb.from('redeems').select('*');
    if (error) { console.error('loadRedeems:', error); return; }
    const loadedRedeems = (data || []).map(redeemFromDb);
    loadedRedeems.sort((a, b) => a.ts - b.ts);
    setRedeems(loadedRedeems);
  };

  const loadAll = async () => {
    await Promise.all([loadProfiles(), loadTodos(), loadNotes(), loadRedeems()]);
  };

  // Reload individual datasets during Realtime updates
  useEffect(() => {
    if (!session) return;
    loadAll();

    // Subscribe to changes
    const realtimeChannel = sb.channel('app-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => {
        loadTodos();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        loadNotes();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'redeems' }, () => {
        loadRedeems();
      })
      .subscribe();

    return () => {
      sb.removeChannel(realtimeChannel);
    };
  }, [session]);

  // Auth Operations
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await sb.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) throw error;
    return await setupSession(data.user);
  };

  const logout = async () => {
    await sb.auth.signOut();
    setSession(null);
    setTodos([]);
    setNotes([]);
    setRedeems([]);
  };

  // Todo Operations
  const addTodos = async (bulkText, cat, pri, status, due, assign, defaultDesc) => {
    if (!bulkText.trim()) return;
    const parsed = parseTasksInput(bulkText);
    if (parsed.length === 0) {
      showToast('No valid tasks found!');
      return;
    }

    const newTodos = parsed.map(t => ({
      id: uid(),
      text: t.text,
      description: t.description || defaultDesc || '',
      cat: t.cat || cat || 'general',
      priority: pri,
      status,
      addedBy: session.role,
      assignTo: assign,
      himDone: status === 'completed',
      herDone: status === 'completed',
      dueDate: due || '',
      createdAt: now(),
      updatedAt: now()
    }));

    setTodos(prev => [...newTodos, ...prev]);
    const { error } = await sb.from('todos').upsert(newTodos.map(todoToDb));
    if (error) {
      console.error('saveTodoBulk:', error);
      showToast('Failed to sync new tasks 😢');
    } else {
      showToast(`Added ${newTodos.length} task${newTodos.length > 1 ? 's' : ''}! 💛`);
    }
  };

  const chkToggle = async (id, who) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    if (who !== session.role) {
      showToast('Only ' + (who === 'him' ? 'Sanjay' : 'She') + ' can tick that!');
      return;
    }

    const updated = { ...t };
    const wasDone = updated.status === 'completed';

    if (who === 'him') updated.himDone = !updated.himDone;
    else updated.herDone = !updated.herDone;

    if (updated.himDone && updated.herDone) updated.status = 'completed';
    else if (updated.himDone || updated.herDone) updated.status = 'in-progress';
    else updated.status = 'pending';

    updated.updatedAt = now();

    // Star pop trigger logic for her tasks
    const isNowDone = updated.status === 'completed';
    const earnedStars = STAR_MAP[updated.priority] || 1;
    let animated = false;

    if (!wasDone && isNowDone && (updated.assignTo === 'her' || updated.assignTo === 'both')) {
      animated = true;
      showToast(`⭐ +${earnedStars} star${earnedStars > 1 ? 's' : ''}! (${updated.priority})`);
    }

    // Optimistic update
    setTodos(prev => prev.map(item => item.id === id ? updated : item));

    const { error } = await sb.from('todos').upsert(todoToDb(updated));
    if (error) {
      console.error('chkToggle update failed:', error);
      showToast('Sync error 😢');
      setTodos(prev => prev.map(item => item.id === id ? t : item)); // rollback
    } else {
      if (updated.himDone && updated.herDone && !wasDone) {
        showToast('🎉 Both done! Teamwork!');
      }
    }

    return { animated, stars: earnedStars };
  };

  const setStatus = async (id, val) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    const updated = { ...t };
    const wasDone = updated.status === 'completed';
    updated.status = val;
    if (val === 'completed') {
      updated.himDone = true;
      updated.herDone = true;
    } else if (val === 'pending') {
      updated.himDone = false;
      updated.herDone = false;
    }
    updated.updatedAt = now();

    const isNowDone = updated.status === 'completed';
    const earnedStars = STAR_MAP[updated.priority] || 1;
    let animated = false;

    if (!wasDone && isNowDone && (updated.assignTo === 'her' || updated.assignTo === 'both')) {
      animated = true;
      showToast(`⭐ +${earnedStars} star${earnedStars > 1 ? 's' : ''}! Keep going! 🔥`);
    }

    setTodos(prev => prev.map(item => item.id === id ? updated : item));
    const { error } = await sb.from('todos').upsert(todoToDb(updated));
    if (error) {
      console.error('setStatus failed:', error);
      showToast('Sync error 😢');
      setTodos(prev => prev.map(item => item.id === id ? t : item));
    }
    return { animated, stars: earnedStars };
  };

  const deleteTodo = async (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    if (t.addedBy !== session.role) {
      showToast('Only the task creator can delete this task!');
      return;
    }

    const conf = await showConfirm('Are you sure you want to delete this task? This action cannot be undone! 🗑️', 'Danger! 🚨');
    if (!conf) return;

    // Optimistic update
    setTodos(prev => prev.filter(x => x.id !== id));
    const { error } = await sb.from('todos').delete().eq('id', id);
    if (error) {
      console.error('deleteTodo failed:', error);
      showToast('Sync error 😢');
      loadTodos();
    } else {
      showToast('Removed ✓');
    }
  };

  const saveEdit = async (id, fields) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    if (t.addedBy !== session.role) {
      showToast('Only the task creator can edit this task!');
      return;
    }

    const conf = await showConfirm('Are you sure you want to save changes to this task? 💾', 'Confirm Save ✦');
    if (!conf) return;

    const updated = { ...t, ...fields };
    if (updated.status === 'completed') {
      updated.himDone = true;
      updated.herDone = true;
    } else if (updated.status === 'pending') {
      updated.himDone = false;
      updated.herDone = false;
    }
    updated.updatedAt = now();

    setTodos(prev => prev.map(item => item.id === id ? updated : item));
    const { error } = await sb.from('todos').upsert(todoToDb(updated));
    if (error) {
      console.error('saveEdit failed:', error);
      showToast('Sync error 😢');
      setTodos(prev => prev.map(item => item.id === id ? t : item));
    } else {
      showToast('✦ Task updated!');
    }
  };

  // Nudges Operations
  const sendNudge = async (nudgeMessage) => {
    const n = {
      id: uid(),
      text: nudgeMessage,
      from: session.role,
      fromName: session.name,
      type: 'nudge',
      ts: now()
    };
    setNotes(prev => [n, ...prev]);
    const { error } = await sb.from('notes').insert(noteToDb(n));
    if (error) {
      console.error('sendNudge error:', error);
      showToast('Nudge sync failed 😢');
    } else {
      showToast('Motivation nudge sent! 💛');
    }
  };

  // Note Operations
  const sendNote = async (text, replyToId) => {
    if (!text.trim()) return;
    const n = {
      id: uid(),
      text: text.trim(),
      from: session.role,
      fromName: session.name,
      type: 'note',
      ts: now(),
      replyTo: replyToId || null
    };
    setNotes(prev => [n, ...prev]);
    const { error } = await sb.from('notes').insert(noteToDb(n));
    if (error) {
      console.error('sendNote error:', error);
      showToast('Note sync failed 😢');
    } else {
      showToast('✦ Sent!');
    }
  };

  // Query Task as message
  const sendTaskQuery = async (todoId, queryText) => {
    const t = todos.find(x => x.id === todoId);
    if (!t) return;
    if (!queryText.trim()) return;

    const recipient = t.assignTo === 'both' ? 'the other' : (t.assignTo === 'him' ? '👦 Sanjay' : '👧 My Love');
    const formattedText = `❓ Question about task [${t.text}]: ${queryText}`;
    const n = {
      id: uid(),
      text: formattedText,
      from: session.role,
      fromName: session.name,
      type: 'note',
      ts: now()
    };

    setNotes(prev => [n, ...prev]);
    const { error } = await sb.from('notes').insert(noteToDb(n));
    if (error) {
      console.error('sendTaskQuery error:', error);
      showToast('Query failed 😢');
    } else {
      showToast(`Question sent to ${recipient}! 🚀`);
    }
  };

  // Star Reward Redemptions
  const calcHerStars = () => {
    let total = 0;
    todos.forEach(t => {
      if ((t.assignTo === 'her' || t.assignTo === 'both') && t.status === 'completed') {
        total += STAR_MAP[t.priority] || 1;
      }
    });
    redeems.forEach(r => {
      if (r.status !== 'rejected') total -= 100;
    });
    return Math.max(0, total);
  };

  const submitRedeem = async (wishMessage, phone) => {
    if (!wishMessage.trim()) return;
    const stars = calcHerStars();
    if (stars < 100) {
      showToast(`Need ${100 - stars} more stars first!`);
      return;
    }

    const conf = await showConfirm('Are you sure you want to redeem 100 stars to make this wish? 🌟', 'Confirm Wish 🎁');
    if (!conf) return;

    const newRedeem = {
      id: uid(),
      message: wishMessage.trim(),
      phone: phone.trim(),
      status: 'pending',
      ts: now(),
      respondedAt: null
    };

    setRedeems(prev => [...prev, newRedeem]);
    const { error } = await sb.from('redeems').insert(redeemToDb(newRedeem));
    if (error) {
      console.error('submitRedeem error:', error);
      showToast('Redeem request failed 😢');
    } else {
      showToast('🎁 Wish sent! He\'ll see it 💛');
    }
  };

  const handleRedeem = async (wishId, newStatus) => {
    const r = redeems.find(x => x.id === wishId);
    if (!r) return;
    const conf = await showConfirm(`Are you sure you want to ${newStatus === 'approved' ? 'grant' : 'deny'} this wish request? 🎁`, 'Respond to Wish ✦');
    if (!conf) return;

    const updated = { ...r, status: newStatus, respondedAt: now() };
    setRedeems(prev => prev.map(item => item.id === wishId ? updated : item));

    const { error } = await sb.from('redeems').update(redeemToDb(updated)).eq('id', wishId);
    if (error) {
      console.error('handleRedeem error:', error);
      showToast('Operation failed 😢');
      setRedeems(prev => prev.map(item => item.id === wishId ? r : item)); // rollback
    } else {
      showToast(newStatus === 'approved' ? '🎁 Wish granted! 💛' : '✗ Wish denied.');
    }
  };

  // Profile management
  const saveProfileChanges = async (newName, newEmoji) => {
    if (!newName.trim() || !newEmoji.trim()) {
      showToast('Name and Avatar/Emoji cannot be empty!');
      return;
    }

    const { error } = await sb.from('profiles').update({ name: newName.trim(), emoji: newEmoji.trim() }).eq('email', session.email);
    if (error) {
      console.error('saveProfileChanges error:', error);
      showToast('Failed to update profile 😢');
      return;
    }

    setSession(prev => ({ ...prev, name: newName.trim(), emoji: newEmoji.trim() }));
    setProfilesMap(prev => ({
      ...prev,
      [session.role]: { name: newName.trim(), emoji: newEmoji.trim() }
    }));
    showToast('Profile updated successfully! ✨');
    setIsProfileModalOpen(false);
  };

  // Bulk parser utility
  function parseTasksInput(raw) {
    raw = raw.trim();
    if (!raw) return [];

    if (raw.startsWith('[') || raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.categories || parsed.project)) {
          const list = [];
          const categories = parsed.categories || [];
          const isSMS = /Sri Balaji|BCA|Student|Faculty|Management/i.test(parsed.project || '');
          const resolvedCat = isSMS ? 'sms' : null;

          for (const cat of categories) {
            const catTitle = cat.title || '';

            if (Array.isArray(cat.tasks)) {
              for (const t of cat.tasks) {
                if (typeof t === 'string' && t.trim()) {
                  list.push({ text: t.trim(), description: catTitle ? `Category: ${catTitle}` : '', cat: resolvedCat });
                } else if (typeof t === 'object' && t !== null) {
                  const text = t.text || t.title || '';
                  const desc = t.description || t.des || t.discription || catTitle || '';
                  if (text.trim()) {
                    list.push({ text: text.trim(), description: desc.trim(), cat: resolvedCat });
                  }
                }
              }
            }

            if (cat.features && typeof cat.features === 'object') {
              for (const [featureName, featureTasks] of Object.entries(cat.features)) {
                if (Array.isArray(featureTasks)) {
                  for (const t of featureTasks) {
                    if (typeof t === 'string' && t.trim()) {
                      list.push({ text: t.trim(), description: catTitle ? `${catTitle} - ${featureName}` : featureName, cat: resolvedCat });
                    } else if (typeof t === 'object' && t !== null) {
                      const text = t.text || t.title || '';
                      const desc = t.description || t.des || t.discription || `${catTitle} - ${featureName}`;
                      if (text.trim()) {
                        list.push({ text: text.trim(), description: desc.trim(), cat: resolvedCat });
                      }
                    }
                  }
                }
              }
            }
          }
          if (list.length > 0) return list;
        }

        const items = Array.isArray(parsed) ? parsed : [parsed];
        return items.map(item => {
          const text = item.text || item.title || '';
          const description = item.description || item.des || item.discription || '';
          return { text: text.trim(), description: description.trim() };
        }).filter(item => item.text.length > 0);
      } catch (e) {
        // Fall through
      }
    }

    const blocks = raw.split(/\n\s*---\s*\n|\n\s*\n/);
    const result = [];

    for (const block of blocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let hasKeys = false;
      const blockData = {};

      for (const line of lines) {
        const match = line.match(/^(title|text|description|discription)\s*:\s*(.*)$/i);
        if (match) {
          const key = match[1].toLowerCase();
          const value = match[2].trim();
          blockData[key] = value;
          hasKeys = true;
        }
      }

      if (hasKeys) {
        const title = blockData['title'] || blockData['text'] || '';
        const description = blockData['description'] || blockData['discription'] || '';
        if (title) result.push({ text: title, description });
      } else {
        for (const line of lines) {
          result.push({ text: line, description: '' });
        }
      }
    }

    return result.filter(item => item.text.length > 0);
  }

  return (
    <AppContext.Provider value={{
      session, loading, todos, notes, redeems, profilesMap,
      flt, setFlt, catFlt, setCatFlt, priFlt, setPriFlt,
      isAddModalOpen, setIsAddModalOpen,
      isProfileModalOpen, setIsProfileModalOpen,
      editTodoId, setEditTodoId,
      queryTodoId, setQueryTodoId,
      toast, showToast,
      confirm, showConfirm, closeConfirm: confirm.resolve,
      login, logout,
      addTodos, chkToggle, setStatus, deleteTodo, saveEdit,
      sendNudge, sendNote, sendTaskQuery,
      calcHerStars, submitRedeem, handleRedeem, saveProfileChanges,
      parseTasksInput
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
