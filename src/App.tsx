import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DailyModule } from '@/modules/daily/DailyModule';
import { LandingPage } from '@/modules/landing/LandingPage';
import { KanbanBoard } from '@/modules/kanban/components/KanbanBoard';
import { PlanningPage } from '@/modules/planning/pages/PlanningPage';
import LearningPage from '@/modules/learning/pages/LearningPage';
import GeneratorPage from '@/modules/learning/pages/GeneratorPage';
import { LearningHub } from '@/modules/learning/pages/LearningHub';
import { SimulatorPage } from '@/modules/learning/pages/SimulatorPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/daily" element={<DailyModule />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/learning" element={<LearningHub />} />
        <Route path="/learning/game" element={<LearningPage />} />
        <Route path="/learning/exam" element={<SimulatorPage />} />
        <Route path="/learning/generator" element={<GeneratorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
