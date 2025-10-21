import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { partyService } from '@services/partyService';
import { formatDate } from '@utils';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const startWeekday = (year, month) => new Date(year, month, 1).getDay();

const Calendar = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: parties = [], isLoading } = useQuery(
    ['calendar-parties'],
    () => partyService.getParties({}),
    { staleTime: 30000 }
  );

  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const p of parties) {
      if (!p.reminder) continue;
      const d = new Date(p.reminder);
      const key = d.toDateString();
      const list = map.get(key) || [];
      list.push(p);
      map.set(key, list);
    }
    return map;
  }, [parties]);

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const total = daysInMonth(y, m);
  const offset = startWeekday(y, m); // 0=Sun
  const days = Array.from({ length: offset + total }, (_, i) => (i < offset ? null : i - offset + 1));

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const changeMonth = (delta) => {
    const d = new Date(y, m + delta, 1);
    setViewDate(d);
  };

  const selectedKey = selectedDate?.toDateString();
  const selectedEvents = selectedKey ? (eventsByDate.get(selectedKey) || []) : [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Calendar</h1>
            <p className="page-subtitle">Reminders by date. Click a day to view parties.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => changeMonth(-1)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700">Prev</button>
            <span className="min-w-[160px] text-center font-medium">{monthLabel}</span>
            <button onClick={() => changeMonth(1)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700">Next</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month grid */}
        <Card>
          <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                if (!day) return <div key={idx} />;
                const d = new Date(y, m, day);
                const key = d.toDateString();
                const count = (eventsByDate.get(key) || []).length;
                const isToday = d.toDateString() === today.toDateString();
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(d)}
                    className={`h-16 rounded-xl border text-sm flex flex-col items-center justify-center transition-colors
                      ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    title={`${day}`}
                  >
                    <span className={`font-medium ${isToday ? 'text-primary-600' : ''}`}>{day}</span>
                    {count > 0 && (
                      <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{count} reminders</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Events list */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{formatDate(selectedDate, 'MMM dd, yyyy')}</h3>
            <Badge variant="secondary">{selectedEvents.length}</Badge>
          </div>
          {selectedEvents.length === 0 ? (
            <div className="p-6 text-gray-500">No reminders for this date.</div>
          ) : (
            <div className="overflow-x-auto px-2 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">S.No</th>
                    <th className="py-2 pr-4">Party Name</th>
                    <th className="py-2 pr-4">Contact</th>
                    <th className="py-2 pr-4">Route</th>
                    <th className="py-2 pr-4">Quantity</th>
                    <th className="py-2 pr-4">Reminder</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEvents.map(p => (
                    <tr key={p._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 pr-4">{p.serialNo}</td>
                      <td className="py-2 pr-4">{p.partyName}</td>
                      <td className="py-2 pr-4">{p.phone || '-'}</td>
                      <td className="py-2 pr-4 capitalize">{p.place || '-'}</td>
                      <td className="py-2 pr-4">{p.quantity ?? '-'}</td>
                      <td className="py-2 pr-4">{p.reminder ? formatDate(p.reminder, 'p') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
