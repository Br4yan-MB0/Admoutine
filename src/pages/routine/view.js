import ProtectedRoute from '../../components/ProtectedRoute';

export default function ViewRoutinePage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Visualizar Rotina</h1>
      </div>
    </ProtectedRoute>
  );
}
