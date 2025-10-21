import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import { partyService } from '@services/partyService';
import { formatDate } from '@utils';

const ROUTE_OPTIONS = [
  { label: 'All Routes', value: '' },
  { label: 'ramanager', value: 'ramanager' },
  { label: 'mampalli', value: 'mampalli' },
];

const Batches = () => {
  const [route, setRoute] = useState('');

  const { data: parties = [], isLoading, refetch } = useQuery(
    ['batches-parties', route],
    () => partyService.getParties(route ? { place: route } : {}),
    { staleTime: 30000 }
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const p of parties) {
      const key = p.batchFrom ? new Date(p.batchFrom).toISOString().slice(0,7) : 'No Period';
      const list = map.get(key) || [];
      list.push(p);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort((a,b) => a[0] > b[0] ? -1 : 1);
  }, [parties]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Batches</h1>
            <p className="page-subtitle">Grouped by batch month. Filter by route to verify navigation.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            >
              {ROUTE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => refetch()}>Refresh</Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : grouped.length === 0 ? (
        <Card>
          <div className="p-6 text-center text-gray-500">No data found.</div>
        </Card>
      ) : (
        grouped.map(([month, items]) => {
          const totalQty = items.reduce((s, x) => s + (x.quantity || 0), 0);
          return (
            <Card key={month}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{month === 'No Period' ? 'No Period' : month}</h3>
                  <Badge variant="primary">{items.length} parties</Badge>
                  <Badge variant="secondary">Qty {totalQty}</Badge>
                </div>
              </div>
              <div className="overflow-x-auto px-2 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">S.No</th>
                      <th className="py-2 pr-4">Party Name</th>
                      <th className="py-2 pr-4">Contact</th>
                      <th className="py-2 pr-4">Route</th>
                      <th className="py-2 pr-4">Quantity</th>
                      <th className="py-2 pr-4">Reminder</th>
                      <th className="py-2 pr-4">Batch Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p._id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 pr-4">{p.serialNo}</td>
                        <td className="py-2 pr-4">{p.partyName}</td>
                        <td className="py-2 pr-4">{p.phone}</td>
                        <td className="py-2 pr-4 capitalize">{p.place || '-'}</td>
                        <td className="py-2 pr-4">{p.quantity ?? '-'}</td>
                        <td className="py-2 pr-4">{p.reminder ? formatDate(p.reminder, 'MMM dd, yyyy') : '-'}</td>
                        <td className="py-2 pr-4">
                          {p.batchFrom ? formatDate(p.batchFrom, 'MMM dd') : '-'}
                          {' '}–{' '}
                          {p.batchTo ? formatDate(p.batchTo, 'MMM dd, yyyy') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default Batches;
