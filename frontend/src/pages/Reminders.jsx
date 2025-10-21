import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import { partyService } from '@services/partyService';
import { formatDate } from '@utils';

const Section = ({ title, items }) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Badge variant="secondary">{items.length}</Badge>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
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
          {items.map(p => (
            <tr key={p._id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="py-2 pr-4">{p.serialNo}</td>
              <td className="py-2 pr-4">{p.partyName}</td>
              <td className="py-2 pr-4">{p.phone || '-'}</td>
              <td className="py-2 pr-4 capitalize">{p.place || '-'}</td>
              <td className="py-2 pr-4">{p.quantity ?? '-'}</td>
              <td className="py-2 pr-4">{p.reminder ? formatDate(p.reminder, 'MMM dd, yyyy p') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const Reminders = () => {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: dueList = [], refetch: refetchDue, isLoading: loadingDue } = useQuery(
    ['reminders-due'],
    () => partyService.getDueReminders(),
    { staleTime: 30000 }
  );

  const { data: allParties = [], refetch: refetchAll, isLoading: loadingAll } = useQuery(
    ['reminders-upcoming'],
    () => partyService.getParties({}),
    { staleTime: 30000 }
  );

  const { dueToday, overdue, upcoming } = useMemo(() => {
    const today = [];
    const over = [];
    const up = [];
    for (const p of dueList) {
      if (!p.reminder) continue;
      const r = new Date(p.reminder);
      const isToday = r.toDateString() === now.toDateString();
      if (isToday) today.push(p); else over.push(p);
    }
    for (const p of allParties) {
      if (!p.reminder) continue;
      const r = new Date(p.reminder);
      if (r > now && r <= in7) up.push(p);
    }
    return { dueToday: today, overdue: over, upcoming: up };
  }, [dueList, allParties]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Reminders</h1>
            <p className="page-subtitle">Due today, overdue, and upcoming (next 7 days).</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => { refetchDue(); refetchAll(); }}>Refresh</Button>
          </div>
        </div>
      </div>

      {loadingDue || loadingAll ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <>
          <Section title="Due Today" items={dueToday} />
          <Section title="Overdue" items={overdue} />
          <Section title="Upcoming (7 days)" items={upcoming} />
        </>
      )}
    </div>
  );
};

export default Reminders;
