import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { partyService } from '@services/partyService';

const PartiesWeight = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ query: '', minNetWeight: '', maxNetWeight: '' });

  const { data: parties = [], isLoading } = useQuery(['parties-weight', filters], () => partyService.searchParties({
    query: filters.query,
    minNetWeight: filters.minNetWeight,
    maxNetWeight: filters.maxNetWeight,
    limit: 200,
  }));

  const updateMutation = useMutation(({ id, update }) => partyService.updateParty(id, update), {
    onSuccess: () => {
      queryClient.invalidateQueries('parties-weight');
    }
  });

  const onChangeWeight = (party, field, value) => {
    const update = { [field]: value === '' ? null : Number(value) };
    updateMutation.mutate({ id: party._id, update });
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parties Weight</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Search party name"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <input
          type="number"
          className="px-3 py-2 border rounded-lg"
          placeholder="Min net weight"
          value={filters.minNetWeight}
          onChange={(e) => setFilters({ ...filters, minNetWeight: e.target.value })}
        />
        <input
          type="number"
          className="px-3 py-2 border rounded-lg"
          placeholder="Max net weight"
          value={filters.maxNetWeight}
          onChange={(e) => setFilters({ ...filters, maxNetWeight: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-2 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full min-w-[700px] divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Serial</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Party</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr><td className="px-4 py-6" colSpan={4}>Loading...</td></tr>
            ) : parties.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={4}>No parties found</td></tr>
            ) : parties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="px-4 py-3">{p.serialNo}</td>
                <td className="px-4 py-3">{p.partyName}</td>
                <td className="px-4 py-3">
                  <input type="number" className="w-28 px-2 py-1 border rounded-lg"
                    value={p.weightNet ?? ''}
                    onChange={(e) => onChangeWeight(p, 'weightNet', e.target.value)} />
                </td>
                <td className="px-4 py-3">
                  <select className="px-2 py-1 border rounded-lg"
                    value={p.weightUnit || 'kg'}
                    onChange={(e) => updateMutation.mutate({ id: p._id, update: { weightUnit: e.target.value } })}
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartiesWeight;






