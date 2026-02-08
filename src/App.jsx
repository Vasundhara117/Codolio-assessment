import React, { useEffect, useState } from 'react';
import { useSheetStore } from './store/useSheetStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronUp, Edit2, Hash } from 'lucide-react';

function SortableTopic({ topic, expanded, onToggle, onRemove, onRename, onAddSub, onAddQuestion }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-indigo-500 transition">
            <GripVertical size={20} />
          </div>
          <button onClick={() => onToggle(topic.id)} className="flex items-center gap-3 text-left">
            <h3 className="font-bold text-slate-800 text-lg">{topic.title}</h3>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={() => {const n = prompt("Rename:", topic.title); if(n) onRename(topic.id, n)}} className="text-slate-300 hover:text-indigo-500 transition-colors">
            <Edit2 size={14} />
          </button>
        </div>
        <button onClick={() => onRemove(topic.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
      </div>
      
      {expanded && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-4">
          {topic.subtopics.map(sub => (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Hash size={12}/> {sub.title}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {sub.questions.map(q => (
                  <div key={q.id} className="p-3 pl-6 flex justify-between items-center group">
                    <span className="text-sm font-medium text-slate-700">{q.title}</span>
                    <a href={q.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100"><ExternalLink size={16} /></a>
                  </div>
                ))}
              </div>
              <button onClick={() => {const n = prompt("Question Name:"); if(n) onAddQuestion(topic.id, sub.id, n)}} className="w-full py-2 text-xs font-bold text-indigo-500 hover:bg-indigo-50 border-t border-slate-100">+ Add Question</button>
            </div>
          ))}
          <button onClick={() => {const n = prompt("Subtopic Name:"); if(n) onAddSub(topic.id, n)}} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all">+ Add Subtopic</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const { topics, isLoading, fetchSheet, addTopic, removeTopic, renameTopic, addSubTopic, addQuestion, reorderTopics } = useSheetStore();
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => { fetchSheet(); }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) reorderTopics(active.id, over.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 mt-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic underline decoration-indigo-500">Codolio<span className="text-indigo-600">Track</span></h1>
            <p className="text-slate-500 font-medium">Topic → Subtopic → Questions</p>
          </div>
          <button onClick={() => {const n = prompt("Topic name:"); if(n) addTopic(n)}} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={18} /> New Topic
          </button>
        </header>

        {isLoading ? <p className="text-center text-slate-400">Loading...</p> : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={topics.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {topics.map((topic) => (
                <SortableTopic 
                  key={topic.id} 
                  topic={topic} 
                  expanded={expandedTopics[topic.id]} 
                  onToggle={(id) => setExpandedTopics(p => ({...p, [id]: !p[id]}))}
                  onRemove={removeTopic}
                  onRename={renameTopic}
                  onAddSub={addSubTopic}
                  onAddQuestion={addQuestion}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default App;