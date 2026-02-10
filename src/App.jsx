import React, { useEffect, useState, useMemo } from 'react';
import { useSheetStore } from './store/useSheetStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripVertical, ExternalLink, ChevronDown, ChevronUp, Edit3, Hash, CheckCircle, Circle, Search, Trophy } from 'lucide-react';

function TopicCard({ topic, isExp, onToggle, store }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // Helper to handle safe editing
  const handleEditTopic = () => {
    const newTitle = prompt("Rename Topic:", topic.title);
    if (newTitle && newTitle.trim() !== "") {
      store.editTopic(topic.id, newTitle.trim());
    }
  };

  const handleEditSub = (subId, currentTitle) => {
    const newTitle = prompt("Rename Sub-topic:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      store.editSub(topic.id, subId, newTitle.trim());
    }
  };

  const handleEditQuestion = (subId, qId, currentTitle, currentUrl) => {
    const newTitle = prompt("Rename Question:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      const newUrl = prompt("Edit URL:", currentUrl);
      store.editQ(topic.id, subId, qId, newTitle.trim(), newUrl || currentUrl);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 rounded-xl border-2 transition-all ${topic.completed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 bg-white shadow-sm'}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-indigo-600"><GripVertical size={20} /></div>
          <div className="cursor-pointer flex items-center gap-2" onClick={() => onToggle(topic.id)}>
            <h2 className={`font-bold text-lg ${topic.completed ? 'text-emerald-700 line-through opacity-70' : 'text-slate-800'}`}>{topic.title}</h2>
            {isExp ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleEditTopic} className="p-2 text-slate-400 hover:text-indigo-500 transition"><Edit3 size={16}/></button>
          <button onClick={() => confirm("Delete entire topic?") && store.deleteTopic(topic.id)} className="p-2 text-slate-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
        </div>
      </div>

      {isExp && (
        <div className="p-4 pt-0 border-t border-slate-50 mt-2 space-y-4">
          {topic.subtopics.map(sub => (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-2 px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1"><Hash size={12}/> {sub.title}</span>
                  <button onClick={() => handleEditSub(sub.id, sub.title)} className="text-slate-300 hover:text-indigo-500 transition"><Edit3 size={12}/></button>
                </div>
                <button onClick={() => confirm("Delete sub-topic?") && store.deleteSub(topic.id, sub.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
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
                        <button onClick={() => handleEditQuestion(sub.id, q.id, q.title, q.url)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition"><Edit3 size={12}/></button>
                      </div>
                      <div className="flex gap-1 ml-8 mt-1 flex-wrap">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : q.difficulty === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {q.difficulty}
                        </span>
                        {q.companies.map(c => <span key={c} className="text-[8px] px-1 bg-slate-100 text-slate-500 rounded uppercase font-bold">{c}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={q.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600"><ExternalLink size={16} /></a>
                      <button onClick={() => store.deleteQ(topic.id, sub.id, q.id)} className="text-slate-400 hover:text-red-500 transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { 
                    const n = prompt("Question Name:"); 
                    if(n && n.trim() !== "") {
                      const u = prompt("URL (optional):");
                      store.addQ(topic.id, sub.id, n.trim(), u); 
                    }
                  }} 
                  className="w-full py-1 text-[10px] font-black uppercase text-indigo-400 hover:bg-indigo-50 rounded transition-colors"
                >
                  + Add Question
                </button>
              </div>
            </div>
          ))}
          <button 
            onClick={() => {
              const name = prompt("Sub-topic name:");
              if(name && name.trim() !== "") store.addSub(topic.id, name.trim());
            }} 
            className="w-full py-2 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all"
          >
            + Add Sub-topic
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const store = useSheetStore();
  const [openStates, setOpenStates] = useState({});
  useEffect(() => { store.initSheet(); }, []);

  const stats = useMemo(() => {
    let total = 0, done = 0;
    store.topics.forEach(t => t.subtopics.forEach(s => s.questions.forEach(q => { total++; if(q.completed) done++; })));
    return { total, done, percent: total > 0 ? Math.round((done/total)*100) : 0 };
  }, [store.topics]);

  const filtered = useMemo(() => {
    if (!store.searchQuery) return store.topics;
    return store.topics.map(t => ({
      ...t,
      subtopics: t.subtopics.map(s => ({
        ...s,
        questions: s.questions.filter(q => q.title.toLowerCase().includes(store.searchQuery.toLowerCase()))
      })).filter(s => s.questions.length > 0)
    })).filter(t => t.subtopics.length > 0);
  }, [store.topics, store.searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="pt-16 pb-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">CODOLIO<span className="text-indigo-600">.</span></h1>
              <p className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase pt-1 italic">STUDENT PREP TRACKER</p>
            </div>
            <button 
              onClick={() => {
                const n = prompt("New Topic Name:");
                if(n && n.trim() !== "") store.addTopic(n.trim());
              }} 
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={20}/> New Topic
            </button>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-indigo-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase opacity-70 flex items-center gap-1"><Trophy size={12}/> Overall Progress</p>
              <h3 className="text-3xl font-black">{stats.percent}% <span className="text-sm font-normal opacity-70">Done</span></h3>
              <p className="text-[10px] italic">{stats.done}/{stats.total} questions mastered</p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-indigo-400/30 flex items-center justify-center text-lg font-black italic">{stats.done}</div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search for a question..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
              value={store.searchQuery}
              onChange={(e) => store.setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <DndContext collisionDetection={closestCenter} onDragEnd={(e) => e.active.id !== e.over?.id && store.reorder(e.active.id, e.over.id)}>
          <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filtered.map(t => <TopicCard key={t.id} topic={t} isExp={openStates[t.id] || store.searchQuery} onToggle={(id) => setOpenStates(p => ({...p, [id]: !p[id]}))} store={store} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}