import React, { useEffect, useState } from 'react';
import { useSheetStore } from './store/useSheetStore';
import { Plus, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronUp, FolderPlus, X, Edit2 } from 'lucide-react';

function App() {
  const { topics, isLoading, fetchSheet, addTopic, removeTopic, addQuestion, removeQuestion, renameTopic, renameQuestion } = useSheetStore();
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    fetchSheet();
  }, [fetchSheet]);

  const toggleExpand = (id) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 mt-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic underline decoration-indigo-500">Codolio<span className="text-indigo-600">Track</span></h1>
            <p className="text-slate-500 font-medium">Full Stack Assessment • 2026</p>
          </div>
          <button onClick={() => {const n = prompt("Topic name:"); if(n) addTopic(n)}} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={18} /> New Topic
          </button>
        </header>

        {isLoading ? <p className="text-center text-slate-400">Loading...</p> : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <GripVertical className="text-slate-300" size={20} />
                    <button onClick={() => toggleExpand(topic.id)} className="flex items-center gap-3 text-left">
                      <h3 className="font-bold text-slate-800 text-lg">{topic.title}</h3>
                      {expandedTopics[topic.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {/* Rename Topic Button */}
                    <button onClick={() => {const n = prompt("Rename topic:", topic.title); if(n) renameTopic(topic.id, n)}} className="text-slate-300 hover:text-indigo-500 transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeTopic(topic.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {expandedTopics[topic.id] && (
                  <div className="bg-slate-50/50 border-t border-slate-100">
                    <div className="divide-y divide-slate-100">
                      {topic.questions.map((q) => (
                        <div key={q.id} className="p-4 pl-14 flex items-center justify-between group hover:bg-white transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-700 font-medium">{q.title}</span>
                            <button onClick={() => {const n = prompt("Rename question:", q.title); if(n) renameQuestion(topic.id, q.id, n)}} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all">
                              <Edit2 size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={q.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                              <ExternalLink size={16} />
                            </a>
                            <button onClick={() => removeQuestion(topic.id, q.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => {const n = prompt("Question Title:"); if(n) addQuestion(topic.id, n)}} className="w-full p-4 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100">
                      <FolderPlus size={16} /> Add Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;