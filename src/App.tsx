import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import Main from './components/Main';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import RegisterPatient from './pages/RegisterPatient';
import ViewPatient from './pages/ViewPatient';
import RunQueries from './pages/RunQueries';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Dashboard/>}/>
            <Route path="/patients" element={<Patients/>}/>
            <Route path="/register-patient" element={<RegisterPatient/>}/>
            <Route path="/view-patient" element={<ViewPatient/>}/>
            <Route path="/view-patient/:patientId" element={<ViewPatient/>}/>
            <Route path="/run-queries" element={<RunQueries />}/>
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  );
}
export default App;