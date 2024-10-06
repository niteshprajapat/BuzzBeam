import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Feed from './pages/Feed/Feed';
import PrivateRoute from './components/ui/Sidebar/PrivateRoute';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import Reels from './pages/Reels/Reels';



const App = () => {
    return (
        <Router>

            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route path='/feed' element={<Feed />} />
                    <Route path='/search' element={<Search />} />
                    <Route path='/reels' element={<Reels />} />
                    {/* <Route path='/followers' element={<Reels />} />
                    <Route path='/following' element={<Reels />} /> */}
                    <Route path='/profile/:id' element={<Profile />} />

                </Route>



            </Routes>

        </Router>
    )
}

export default App