import { useEffect, useState } from 'react';
import api from '../lib/api';
import PageHeader from '../components/PageHeader';
import { Card, IconTile, MonoLabel, Spinner } from '../components/ui/Primitives';
import { CategoryBarChart } from '../components/charts/Charts';
import { IconBuilding } from '../components/ui/icons';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dep, emp] = await Promise.all([api.get('/departments'), api.get('/employees')]);
        setDepartments(dep.data);
        setEmployees(emp.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const countFor = (id) => employees.filter((e) => e.department?.id === id).length;
  const chartData = departments.map((d) => ({ label: d.code || d.name, value: countFor(d.id) }));

  return (
    <div>
      <PageHeader
        eyebrow={`${departments.length} departments`}
        title="Departments"
        subtitle="Teams and headcount across the organization."
      />

      <Card className="mb-6">
        <MonoLabel className="mb-4">Headcount by department</MonoLabel>
        <CategoryBarChart data={chartData} />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const head = employees.find((e) => e.id === d.headId);
          return (
            <Card key={d.id}>
              <div className="flex items-start justify-between">
                <IconTile colorKey={d.colorKey} size="lg"><IconBuilding size={22} /></IconTile>
                <div className="text-right">
                  <div className="text-2xl font-bold text-ink">{countFor(d.id)}</div>
                  <MonoLabel>members</MonoLabel>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-ink">{d.name}</div>
                <div className="text-xs text-muted">
                  {head ? `Led by ${head.fullName}` : `Code ${d.code}`}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
