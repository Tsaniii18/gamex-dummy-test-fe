import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import GameList from './pages/Games/GameList';
import GameDetail from './pages/Games/GameDetail';
import CreateGame from './pages/Games/CreateGame';
import MyGames from './pages/Games/MyGames';
import EditGame from './pages/Games/EditGame';
import Profile from './pages/Users/Profile';
import Library from './pages/Users/Library';
import PurchaseHistory from './pages/Users/PurchaseHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Public game routes */}
            <Route path="/games" element={<GameList />} />
            <Route path="/games/:id" element={<GameDetail />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/games/create" element={<CreateGame />} />
              <Route path="/games/my-games" element={<MyGames />} />
              <Route path="/games/:id/edit" element={<EditGame />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<Library />} />
              <Route path="/history" element={<PurchaseHistory />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;