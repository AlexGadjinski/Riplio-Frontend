import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityPage from './pages/CommunityPage'
import TrendingPage from './pages/TrendingPage'
import PostPage from './pages/PostPage'
import MembersPage from './pages/MembersPage'
import BansPage from './pages/BansPage'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout/>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/communities" element={<CommunitiesPage/>}/>
                        <Route path="/communities/:id" element={<CommunityPage/>}/>
                        <Route path="/trending" element={<TrendingPage/>}/>
                        <Route path="/posts/:id" element={<PostPage/>}/>
                        <Route path="/communities/:id/members" element={<MembersPage/>}/>
                        <Route path="/communities/:id/bans" element={<BansPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App