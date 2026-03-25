import {
  FaCalendarAlt, FaPlus, FaClock, FaEye
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const STATUS_SHADOW = {
  draft:     'bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.5)]',
  scheduled: 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]',
  sent:      'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]',
};

export default function CalendarTab({ newsletters, onCompose }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const scheduledMap = {};
  for (const nl of newsletters) {
    if (nl.scheduledAt) {
      const d = new Date(nl.scheduledAt);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const key = d.getDate();
        if (!scheduledMap[key]) scheduledMap[key] = [];
        scheduledMap[key].push(nl);
      }
    }
  }

  const selectedNLs = selectedDate ? (scheduledMap[selectedDate] || []) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
      <div className="lg:col-span-3 bg-gray-900/60 border border-gray-800 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-800 bg-black/20">
          <button onClick={prevMonth} className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all">←</button>
          <h3 className="text-xl font-black uppercase tracking-[0.4em] text-white" style={{ fontFamily: 'Impact, sans-serif' }}>
            {MONTH_NAMES[viewMonth]} <span className="text-gray-600">{viewYear}</span>
          </h3>
          <button onClick={nextMonth} className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all">→</button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-800 bg-black/40">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[10px] font-black text-gray-500 uppercase py-4 tracking-widest leading-none">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`blank-${i}`} className="h-28 border-b border-r border-gray-800/20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const items = scheduledMap[day] || [];
            const isSelected = selectedDate === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`h-28 border-b border-r border-gray-800/20 p-3 cursor-pointer transition-all relative group
                  ${isSelected ? 'bg-green-500/10' : 'hover:bg-white/5'}
                  ${isToday ? 'bg-gray-800/40' : ''}`}
              >
                <span className={`text-sm font-black tracking-widest ${isToday ? 'text-green-400' : isSelected ? 'text-green-300' : 'text-gray-700'} group-hover:text-gray-300 transition-colors`}>{day.toString().padStart(2, '0')}</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {items.map((nl) => (
                    <div key={nl._id} className={`w-2.5 h-2.5 rounded-full ${STATUS_SHADOW[nl.status]}`} title={nl.title} />
                  ))}
                </div>
                {isToday && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-8 flex flex-col h-full">
         <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div key="panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-gray-900 border border-success-500/20 rounded-[40px] p-8 flex flex-col flex-1 shadow-2xl backdrop-blur-xl">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3 mb-8">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   {selectedDate} {MONTH_NAMES[viewMonth].toUpperCase()}
                 </h4>
                 {selectedNLs.length ? (
                   <div className="space-y-4 flex-1">
                     {selectedNLs.map((nl) => (
                       <div key={nl._id} className="p-5 bg-black/40 rounded-3xl border border-gray-800 hover:border-blue-500/40 transition-all">
                         <p className="text-[11px] font-black text-white uppercase tracking-wider truncate mb-1">{nl.title}</p>
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter truncate">{nl.subject}</p>
                         <div className="mt-3 flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${STATUS_SHADOW[nl.status].split(' ')[0]} text-black`}>{nl.status}</span>
                            <span className="text-[9px] text-gray-600 font-mono">{new Date(nl.scheduledAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                      <FaClock size={40} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2">No Active Logs</p>
                   </div>
                 )}
                 <motion.button whileHover={{ y: -4 }} onClick={() => onCompose(selectedDate, viewMonth, viewYear)} className="mt-8 py-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-2">
                   <FaPlus size={10} /> INITIATE_LOG
                 </motion.button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/40 border border-gray-800 rounded-[40px] p-8 text-center flex flex-col items-center justify-center flex-1 backdrop-blur-md opacity-40">
                <FaCalendarAlt size={50} className="mb-6 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Select Marker to Proceed</p>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
