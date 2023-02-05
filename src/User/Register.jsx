import React, { useState } from 'react';
import ButtonComponent from '../component/ButtonComponent';
import { postToServer } from '../services/getAPI';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import NavBarComponent from '../component/NavBarComponent';

export default function Register(props) {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [userNameError, setUserNameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const nav = useNavigate();

	const onRegistration = (e) => {
		if (!userName) setUserNameError('Your name is required');
		else if (!password) setPasswordError('Password is required');
		else if (!confirmPassword) setConfirmPasswordError('Password is required');
		else if (password != confirmPassword) setConfirmPasswordError('Password mismatch');
		else {
			setLoading(true);
			postToServer('/v1/auth/register', { username: userName, password })
				.then((result) => {
					toast.success(result.message);
					setUserName('');
					setPassword('');
					setConfirmPassword('');
					nav('/login');
				})
				.catch((text) => toast.error(text.message))
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
					Sign up
				</h1>
				<div className={`mb-3 d-flex align-items-center justify-content-between input-group form-control border`}>
					<input
						type="email"
						className="border-0 flex-grow-1"
						value={userName}
						onChange={(e) => {
							setUserName(e.target.value);
							setUserNameError('');
						}}
						onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
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
							setPasswordError('');
						}}
						onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
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
				<div
					className={`mb-3 d-flex align-items-center justify-content-between input-group border form-control border`}>
					<input
						type="password"
						className="border-0 flex-grow-1"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							setConfirmPasswordError('');
						}}
						onKeyDown={e=>{if(e.key === "Enter") onRegistration(e)}}
						placeholder="Re-enter Password"
						autocomplete="off"
						style={{ height: '45px', outline: 'none' }}
					/>
					<span className="material-symbols-outlined sc-color">password</span>
				</div>
				{confirmPasswordError && (
					<p className="d-flex align-items-center" style={{ color: 'red', width: '100%' }}>
						<span className="material-symbols-outlined me-1" style={{ color: 'red' }}>
							error
						</span>
						{confirmPasswordError}
					</p>
				)}
				{loading ? <div className="spinner-grow"></div> : <ButtonComponent label="sign up" onClick={onRegistration} />}
				<div className="mt-3 d-flex align-items-center justify-content-center">
					<hr style={{ width: '140px' }} />
					<span className="mx-3 text-uppercase">or</span>
					<hr style={{ width: '140px' }} />
				</div>
				<div className="mt-3 d-flex flex-row justify-content-end w-100">
					<span className="me-1">Already have an account?</span>
					<Link className="text-capitalize sc-color" to={'/login'}>login</Link>
				</div>
			</div>
		</div>
	);
}
