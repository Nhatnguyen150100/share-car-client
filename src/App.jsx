import Login from './User/Login.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from './User/Register.jsx';
import HomePage from './pages/HomePage.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Profile from './pages/setting/Profile.jsx';
import ListTrip from './pages/ListTrip.jsx';
import HomePageAdmin from './admin/HomePageAdmin.jsx';


function App() {
	const user = useSelector((state) => state.user);
	const nav = useNavigate();

	useEffect(() => {
    if (!user.data.accessToken && window.location.href!='http://localhost:5173/register') {
      toast.info("Please login to use. If you don't have an account you can register a new account");
      nav("/login");
	  }
	},[user.data.accessToken])

	return (
		<Routes>
			<Route path="/sc-admin" element={<HomePageAdmin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
			<Route path="/list-car" element={<ListTrip />} />
			<Route path="/profile" element={<Profile/>} />
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
		</Routes>
	);
}

export default App;
