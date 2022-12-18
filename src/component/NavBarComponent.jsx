import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postToServerWithToken } from '../services/getAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setData } from '../redux/UserSlice';
import { setDataDriver } from '../redux/DriverSlice';

export default function NavBarComponent(props) {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const nav = useNavigate();

	const logOut = () => {
		if(confirm(`Log out from ${user.data.fullName}`)){
      postToServerWithToken('/v1/auth/logout',{},user.data.accessToken)
      .then((result) => {
        toast.success(result.status);
        dispatch(setData({}));
		dispatch(setDataDriver({}));
        nav('/login');
      })
      .catch((text) => toast.error(text)).finally(()=>{dispatch(setData({}));dispatch(setDataDriver({}))});
		}
	};

	return (
		<nav
			className="navbar navbar-expand-lg w-100 sc-background-color py-3">
			<div className="container-fluid">
				<div className="container d-flex justify-content-between align-items-center">
					<div className='d-flex flex-row justify-content-end align-items-center'>
						<a className='d-flex flex-row align-items-center' href='/' style={{textDecoration:"none"}}>
							<div
							className="rounded mb-1"
							style={{
								height: '30px',
								width: '30px',
								backgroundImage: `url("/assets/icon/taxi.png")`,
								backgroundSize: '100% 100%',
							}}></div>
							<h2 className="p-0 mb-0 ms-2" style={{fontWeight:"600",color:"white"}}>Share Car</h2>
						</a>
						<a className='d-flex flex-row align-items-center ms-4' href='/list-car' style={{textDecoration:"none",borderLeft:"double",borderColor:"white"}}>
							<h3 className="p-0 mb-0 ms-4" style={{fontWeight:"600",color:"white"}}>List Trip</h3>
						</a>
          </div>
					<div className="dropdown">
						<button
							className="btn btn-outline-light dropdown-toggle d-flex flex-row align-items-center"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false">
							<div
								className="me-2"
								style={{
									height: '20px',
									width: '20px',
									backgroundImage: `url("/assets/icon/user-icon.png")`,
									backgroundSize: '100% 100%',
								}}></div>
							<span className="me-1 fw-bold">Welcome {user.data.fullName}</span>
						</button>
						{user.data.accessToken && (
							<ul className="dropdown-menu w-100">
								<li>
									<a className="dropdown-item" href='/profile' style={{ cursor: 'pointer' }}>
										Profile
									</a>
								</li>
								<li>
									<a className="dropdown-item" onClick={logOut} style={{ cursor: 'pointer' }}>
										Log out
									</a>
								</li>
							</ul>)
						}
					</div>
				</div>
			</div>
		</nav>
	);
}
