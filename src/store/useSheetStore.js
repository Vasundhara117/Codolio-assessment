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
        subtopics: [{
          id: uuid(),
          title: "Standard Problems",
          questions: section.questions.slice(0, 3).map(q => ({
            id: uuid(),
            title: q.title,
            url: q.url || '#'
          }))
        }]
      }));
      set({ topics: formatted, isLoading: false });
      localStorage.setItem('codolio-data', JSON.stringify(formatted));
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addTopic: (title) => set((state) => {
    const next = [...state.topics, { id: uuid(), title, subtopics: [] }];
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  addSubTopic: (topicId, title) => set((state) => {
    const next = state.topics.map(t => 
      t.id === topicId ? { ...t, subtopics: [...t.subtopics, { id: uuid(), title, questions: [] }] } : t
    );
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  }),

  addQuestion: (topicId, subId, title) => set((state) => {
    const next = state.topics.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        subtopics: t.subtopics.map(st => 
          st.id === subId ? { ...st, questions: [...st.questions, { id: uuid(), title, url: '#' }] } : st
        )
      };
    });
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

  // Drag and Drop Logic
  reorderTopics: (activeId, overId) => set((state) => {
    const oldIndex = state.topics.findIndex((t) => t.id === activeId);
    const newIndex = state.topics.findIndex((t) => t.id === overId);
    const next = arrayMove(state.topics, oldIndex, newIndex);
    localStorage.setItem('codolio-data', JSON.stringify(next));
    return { topics: next };
  })
}));