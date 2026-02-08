import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

export const useSheetStore = create((set) => ({
  topics: JSON.parse(localStorage.getItem('codolio-data')) || [],
  isLoading: false,

  fetchSheet: async () => {
    if (useSheetStore.getState().topics.length > 0) return;
    set({ isLoading: true });
    try {
      const res = await fetch('https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet');
      const json = await res.json();
      
      const formatted = json.data.sections.map(section => ({
        id: uuid(),
        title: section.title,
        completed: false,
        subtopics: [
          {
            id: uuid(),
            title: "Main Problems",
            completed: false,
            questions: section.questions.slice(0, 3).map(q => ({
              id: uuid(),
              title: q.title,
              url: q.url || '#',
              completed: false
            }))
          }
        ]
      }));
      set({ topics: formatted, isLoading: false });
      localStorage.setItem('codolio-data', JSON.stringify(formatted));
    } catch (err) {
      set({ isLoading: false });
    }
  },

  // --- TOPIC ACTIONS ---
  addTopic: (title) => set((state) => {
    const next = [...state.topics, { id: uuid(), title, completed: false, subtopics: [] }];
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  renameTopic: (id, newTitle) => set((state) => {
    const next = state.topics.map(t => t.id === id ? { ...t, title: newTitle } : t);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  removeTopic: (id) => set((state) => {
    const next = state.topics.filter(t => t.id !== id);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  // --- SUB-TOPIC ACTIONS ---
  addSubTopic: (topicId, title) => set((state) => {
    const next = state.topics.map(t => 
      t.id === topicId ? { ...t, subtopics: [...t.subtopics, { id: uuid(), title, completed: false, questions: [] }], completed: false } : t
    );
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  renameSubTopic: (topicId, subId, newTitle) => set((state) => {
    const next = state.topics.map(t => t.id === topicId ? {
      ...t, subtopics: t.subtopics.map(st => st.id === subId ? { ...st, title: newTitle } : st)
    } : t);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  removeSubTopic: (topicId, subId) => set((state) => {
    const next = state.topics.map(t => t.id === topicId ? {
      ...t, subtopics: t.subtopics.filter(st => st.id !== subId)
    } : t);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  // --- QUESTION ACTIONS ---
  addQuestion: (topicId, subId, title) => set((state) => {
    const next = state.topics.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        completed: false,
        subtopics: t.subtopics.map(st => 
          st.id === subId ? { ...st, completed: false, questions: [...st.questions, { id: uuid(), title, url: '#', completed: false }] } : st
        )
      };
    });
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  renameQuestion: (topicId, subId, qId, newTitle) => set((state) => {
    const next = state.topics.map(t => t.id === topicId ? {
      ...t, subtopics: t.subtopics.map(st => st.id === subId ? {
        ...st, questions: st.questions.map(q => q.id === qId ? { ...q, title: newTitle } : q)
      } : st)
    } : t);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  removeQuestion: (topicId, subId, qId) => set((state) => {
    const next = state.topics.map(t => t.id === topicId ? {
      ...t, subtopics: t.subtopics.map(st => st.id === subId ? {
        ...st, questions: st.questions.filter(q => q.id !== qId)
      } : st)
    } : t);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  // --- COMPLETION LOGIC (The Tick Mark Ripple) ---
  toggleQuestion: (topicId, subId, qId) => set((state) => {
    const next = state.topics.map(t => {
      if (t.id !== topicId) return t;

      const updatedSubtopics = t.subtopics.map(st => {
        if (st.id !== subId) return st;
        const newQuestions = st.questions.map(q => 
          q.id === qId ? { ...q, completed: !q.completed } : q
        );
        const allQuestionsDone = newQuestions.length > 0 && newQuestions.every(q => q.completed);
        return { ...st, questions: newQuestions, completed: allQuestionsDone };
      });

      const allSubtopicsDone = updatedSubtopics.length > 0 && updatedSubtopics.every(st => st.completed);
      return { ...t, subtopics: updatedSubtopics, completed: allSubtopicsDone };
    });

    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  // --- REORDERING (Drag and Drop) ---
  reorderTopics: (activeId, overId) => set((state) => {
    const oldIndex = state.topics.findIndex((t) => t.id === activeId);
    const newIndex = state.topics.findIndex((t) => t.id === overId);
    const next = arrayMove(state.topics, oldIndex, newIndex);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  })
}));