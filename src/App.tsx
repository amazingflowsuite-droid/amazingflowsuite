import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DailyModule } from '@/modules/daily/DailyModule';
import { LandingPage } from '@/modules/landing/LandingPage';
import { KanbanBoard } from '@/modules/kanban/components/KanbanBoard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/daily" element={<DailyModule />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
