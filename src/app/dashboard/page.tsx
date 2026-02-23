import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/features/dashboard/components/Dashboard'), { ssr: false });

export default function DashboardPage() {
  return <Dashboard />;
}
