import React, { useState } from 'react';
import ButtonComponent from '../component/ButtonComponent';
import { postToServer } from '../services/getAPI';
import { toast } from 'react-toastify';
import { setData } from '../redux/UserSlice.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import NavBarComponent from '../component/NavBarComponent';

export default function Login(props) {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [userNameError, setUsernameError] = useState();
	const [passwordError, setPasswordError] = useState();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const nav = useNavigate();

	const loginSubmit = (e) => {
		if (!userName) setUsernameError('User name is required');
		else if (!password) setPasswordError('Password is required');
		else {
			setLoading(true);
			postToServer('/v1/auth/login', { username: userName, password })
				.then((result) => {
					if (result == 'Wrong username!') toast.error(result.message);
					else {
						toast.success(result.message);
						dispatch(setData(result.data));
						if(result.data.roleId === 1) nav('/sc-admin')
						else nav('/');
					}
				})
				.catch((text) => toast.error(text))
				.finally(() => setLoading(false));
		}
	};

	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center"
			style={{
				height: '100%',
				backgroundImage: `url("/assets/images/login_background.jpg")`,
				backgroundSize: '100% 100%',
			}}>
			<div
				className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
				style={{ width: '360px' }}>
				<h1 className="my-4 text-center viceph-color text-capitalize sc-color" style={{ fontWeight: 'bold' }}>
					login
				</h1>
				<div className={`mb-3 d-flex align-items-center justify-content-between input-group form-control border`}>
					<input
						type="email"
						className="border-0 flex-grow-1"
						value={userName}
						onChange={(e) => {
							setUserName(e.target.value);
							setUsernameError('');
						}}
						onKeyDown={e=>{if(e.key === "Enter") loginSubmit(e)}}
						placeholder="User name"
						autocomplete="off"
						style={{ height: '45px', outline: 'none' }}
					/>
					<span className="material-symbols-outlined sc-color">person</span>
				</div>
				{userNameError && (
					<p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
						<span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
							error
						</span>
						{userNameError}
					</p>
				)}
				<div
					className={`mb-3 d-flex align-items-center justify-content-between input-group border form-control border`}>
					<input
						type="password"
						className="border-0 flex-grow-1"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setPasswordError;
						}}
						onKeyDown={e=>{if(e.key === "Enter") loginSubmit(e)}}
						placeholder="Password"
						autocomplete="off"
						style={{ height: '45px', outline: 'none' }}
					/>
					<span className="material-symbols-outlined sc-color">password</span>
				</div>
				{passwordError && (
					<p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
						<span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
							error
						</span>
						{passwordError}
					</p>
				)}
				<div className="d-flex justify-content-end mb-4 text-capitalize" style={{ width: '100%' }}>
					<a className="text-capitalize sc-color" href="#">
						forgot Password?
					</a>
				</div>
				{loading ? <div className="spinner-grow"></div> : <ButtonComponent label="login" onClick={loginSubmit} />}
				<div className="mt-3 d-flex align-items-center justify-content-center">
					<hr style={{ width: '140px' }} />
					<span className="mx-3 text-uppercase">or</span>
					<hr style={{ width: '140px' }} />
				</div>
				<div className="mt-3 d-flex flex-row justify-content-end w-100">
					<span className="me-1">Don't have an account</span>
					<Link className='text-capitalize sc-color' to={'/register'}>register</Link>
				</div>
			</div>
		</div>
	);
}
