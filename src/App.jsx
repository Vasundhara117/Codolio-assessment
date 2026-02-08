import React, { useEffect, useState } from 'react';
import { useSheetStore } from './store/useSheetStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, Trash2, GripVertical, ExternalLink, ChevronDown, 
  ChevronUp, Edit2, Hash, X, CheckCircle2, Circle 
} from 'lucide-react';

function SortableTopic({ topic, expanded, onToggle, store }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white border ${topic.completed ? 'border-green-200' : 'border-slate-200'} rounded-2xl shadow-sm overflow-hidden mb-4`}>
      <div className={`p-4 flex justify-between items-center ${topic.completed ? 'bg-green-50/50' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-indigo-500 transition">
            <GripVertical size={20} />
          </div>
          <button onClick={() => onToggle(topic.id)} className="flex items-center gap-3 text-left">
            <h3 className={`font-bold text-lg ${topic.completed ? 'text-green-700' : 'text-slate-800'}`}>
              {topic.title}
              {topic.completed && <CheckCircle2 size={16} className="inline ml-2 text-green-500" />}
            </h3>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={() => {const n = prompt("Rename Topic:", topic.title); if(n) store.renameTopic(topic.id, n)}} className="text-slate-300 hover:text-indigo-500"><Edit2 size={14} /></button>
        </div>
        <button onClick={() => store.removeTopic(topic.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
      </div>
      
      {expanded && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-4">
          {topic.subtopics.map(sub => (
            <div key={sub.id} className={`bg-white border ${sub.completed ? 'border-green-100 shadow-green-50' : 'border-slate-200'} rounded-xl overflow-hidden shadow-sm`}>
              <div className={`p-2 ${sub.completed ? 'bg-green-50/30' : 'bg-slate-50'} border-b border-slate-100 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase flex items-center gap-1 ${sub.completed ? 'text-green-600' : 'text-slate-400'}`}>
                    <Hash size={12}/> {sub.title}
                    {sub.completed && <CheckCircle2 size={12} className="text-green-500" />}
                  </span>
                  <button onClick={() => {const n = prompt("Rename Sub-topic:", sub.title); if(n) store.renameSubTopic(topic.id, sub.id, n)}} className="text-slate-300 hover:text-indigo-500"><Edit2 size={12}/></button>
                </div>
                <button onClick={() => store.removeSubTopic(topic.id, sub.id)} className="text-slate-300 hover:text-red-500"><X size={14}/></button>
              </div>
              <div className="divide-y divide-slate-50">
                {sub.questions.map(q => (
                  <div key={q.id} className="p-3 pl-6 flex justify-between items-center group hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-3">
                      <button onClick={() => store.toggleQuestion(topic.id, sub.id, q.id)} className="transition-transform active:scale-90">
                        {q.completed ? <CheckCircle2 size={18} className="text-green-500 fill-green-50" /> : <Circle size={18} className="text-slate-300" />}
                      </button>
                      <span className={`text-sm font-medium transition-all ${q.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {q.title}
                      </span>
                      <button onClick={() => {const n = prompt("Rename Question:", q.title); if(n) store.renameQuestion(topic.id, sub.id, q.id, n)}} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"><Edit2 size={12}/></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={q.url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"><ExternalLink size={16} /></a>
                      <button onClick={() => store.removeQuestion(topic.id, sub.id, q.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => {const n = prompt("Question Name:"); if(n) store.addQuestion(topic.id, sub.id, n)}} className="w-full py-2 text-xs font-bold text-indigo-500 hover:bg-indigo-50 border-t border-slate-100">+ Add Question</button>
            </div>
          ))}
          <button onClick={() => {const n = prompt("Sub-topic Name:"); if(n) store.addSubTopic(topic.id, n)}} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all">+ Add Sub-topic</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const store = useSheetStore();
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => { store.fetchSheet(); }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) store.reorderTopics(active.id, over.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 mt-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic underline decoration-indigo-500">Codolio<span className="text-indigo-600">Track</span></h1>
            <p className="text-slate-500 font-medium tracking-tight uppercase text-xs pt-1">Question Management Sheet</p>
          </div>
          <button onClick={() => {const n = prompt("Topic name:"); if(n) store.addTopic(n)}} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={18} /> New Topic
          </button>
        </header>

        {store.isLoading ? <p className="text-center text-slate-400 py-20">Loading sheet data...</p> : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={store.topics.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {store.topics.map((topic) => (
                <SortableTopic 
                  key={topic.id} 
                  topic={topic} 
                  expanded={expandedTopics[topic.id]} 
                  onToggle={(id) => setExpandedTopics(p => ({...p, [id]: !p[id]}))}
                  store={store}
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