import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import Main from './components/Main';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Dashboard/>}/>
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  );
}
export default App;