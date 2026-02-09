import React, { useEffect, useState } from 'react';
import { useSheetStore } from './store/useSheetStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronUp, Edit3, Hash, CheckCircle, Circle } from 'lucide-react';

function TopicCard({ topic, isExp, onToggle, store }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 rounded-xl border-2 transition-all ${topic.completed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 bg-white shadow-sm'}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-indigo-600"><GripVertical size={20} /></div>
          <div className="cursor-pointer" onClick={() => onToggle(topic.id)}>
            <div className="flex items-center gap-2">
              <h2 className={`font-bold text-lg ${topic.completed ? 'text-emerald-700 line-through opacity-70' : 'text-slate-800'}`}>{topic.title}</h2>
              {topic.completed && <CheckCircle size={18} className="text-emerald-500" />}
              {isExp ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { const n = prompt("Rename Topic:", topic.title); if(n) store.editTopic(topic.id, n) }} className="p-2 text-slate-400 hover:text-indigo-500"><Edit3 size={16}/></button>
          <button onClick={() => { if(confirm("Delete topic?")) store.deleteTopic(topic.id) }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
        </div>
      </div>

      {isExp && (
        <div className="p-4 pt-0 border-t border-slate-50 mt-2 space-y-4">
          {topic.subtopics.map(sub => (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-2 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1"><Hash size={12}/> {sub.title}</span>
                  <button onClick={() => { const n = prompt("Rename Sub-topic:", sub.title); if(n) store.editSub(topic.id, sub.id, n) }} className="text-slate-300 hover:text-indigo-500"><Edit3 size={12}/></button>
                </div>
                <button onClick={() => { if(confirm("Delete sub-topic?")) store.deleteSub(topic.id, sub.id) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
              <div className="p-2 space-y-1">
                {sub.questions.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md group">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <button onClick={() => store.toggleQ(topic.id, sub.id, q.id)}>
                          {q.completed ? <CheckCircle size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-200" />}
                        </button>
                        <span className={`text-sm font-medium ${q.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{q.title}</span>
                        <button onClick={() => { const n = prompt("Rename Question:", q.title); if(n) store.editQ(topic.id, sub.id, q.id, n) }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"><Edit3 size={12}/></button>
                      </div>
                      {q.companies && q.companies.length > 0 && (
                        <div className="flex gap-1 ml-8 mt-1 flex-wrap">
                          {q.companies.map(c => (
                            <span key={c} className="text-[8px] px-1 bg-slate-100 text-slate-500 rounded uppercase font-black">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={q.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600"><ExternalLink size={16} /></a>
                      <button onClick={() => store.deleteQ(topic.id, sub.id, q.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { const n = prompt("Question Name:"); if(n) store.addQ(topic.id, sub.id, n) }} className="w-full py-1 text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors">+ Add Question</button>
              </div>
            </div>
          ))}
          <button onClick={() => { const n = prompt("Subtopic name:"); if(n) store.addSub(topic.id, n) }} className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50">+ Add Sub-topic</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const store = useSheetStore();
  const [openStates, setOpenStates] = useState({});
  useEffect(() => { store.initSheet(); }, []);
  const onDnd = (e) => { if (e.active.id !== e.over?.id) store.reorder(e.active.id, e.over.id); };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h1 className="text-4xl font-black italic tracking-tighter uppercase">CODOLIO<span className="text-indigo-600">.</span></h1><p className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase pt-1 italic underline decoration-indigo-400">STUDENT PREP TRACKER (2ND YEAR)</p></div>
          <button onClick={() => { const n = prompt("New Topic Name:"); if(n) store.addTopic(n) }} className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg flex items-center gap-2 shadow-indigo-100"><Plus size={20}/> New Topic</button>
        </header>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDnd}>
          <SortableContext items={store.topics.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {store.topics.length > 0 ? store.topics.map(t => (<TopicCard key={t.id} topic={t} isExp={openStates[t.id]} onToggle={(id) => setOpenStates(p => ({...p, [id]: !p[id]}))} store={store} />)) 
              : <div className="py-20 text-center text-slate-300 italic">No topics found.</div>}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}