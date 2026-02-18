import DashboardHome from '../../components/Dashboard/DashboardHome';
import AppLayout from '../../components/Layout/AppLayout';
import styles from "../../styles/Home.module.css";

export default function HomePage() {
  return (
    <AppLayout>
      <DashboardHome />
    </AppLayout>
  );
}
