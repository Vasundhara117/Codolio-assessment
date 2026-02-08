import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

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
        questions: section.questions.slice(0, 3).map(q => ({
          id: uuid(),
          title: q.title,
          url: q.url || '#'
        }))
      }));
      set({ topics: formatted, isLoading: false });
      localStorage.setItem('codolio-data', JSON.stringify(formatted));
    } catch (err) {
      set({ isLoading: false });
    }
  },

  addTopic: (title) => set((state) => {
    const newTopics = [...state.topics, { id: uuid(), title, questions: [] }];
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  }),

  // NEW: Rename Topic
  renameTopic: (id, newTitle) => set((state) => {
    const newTopics = state.topics.map(t => t.id === id ? { ...t, title: newTitle } : t);
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  }),

  removeTopic: (id) => set((state) => {
    const newTopics = state.topics.filter(t => t.id !== id);
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  }),

  addQuestion: (topicId, qTitle) => set((state) => {
    const newTopics = state.topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, questions: [...topic.questions, { id: uuid(), title: qTitle, url: '#' }] }
        : topic
    );
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  }),

  // NEW: Rename Question
  renameQuestion: (topicId, qId, newTitle) => set((state) => {
    const newTopics = state.topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, questions: topic.questions.map(q => q.id === qId ? { ...q, title: newTitle } : q) }
        : topic
    );
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  }),

  removeQuestion: (topicId, questionId) => set((state) => {
    const newTopics = state.topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, questions: topic.questions.filter(q => q.id !== questionId) }
        : topic
    );
    localStorage.setItem('codolio-data', JSON.stringify(newTopics));
    return { topics: newTopics };
  })
}));