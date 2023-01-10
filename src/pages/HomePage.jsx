import React, { useState } from 'react';
import NavBarComponent from '../component/NavBarComponent.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setDataCity } from '../redux/CitySlice.jsx';
import { getToServerWithTokenAndUserObject } from '../services/getAPI.jsx';

export default function HomePage() {
	const user = useSelector((state) => state.user);
  	const dispatch = useDispatch();
	const nav = useNavigate();

	useEffect(()=>{
    if (!user.data) {
      nav('/login');
    }
		getCity();
	},[])

	const getCity = () => {
    getToServerWithTokenAndUserObject('/v1/city',
    {},user.accessToken)
    .then((result) => {
      dispatch(setDataCity(result.data));
    })
    .catch((result) => toast.error(result.message));
  } 

	return (
		<div
			className="d-flex flex-column justify-content-center align-items-center"
			style={{
				height: '100%',
				backgroundImage: `url("/assets/images/login_background.jpg")`,
				backgroundSize: '100% 100%',
			}}>
			<NavBarComponent />
			<div className="d-flex flex-row justify-content-start align-items-center h-100 w-100">
				<div
					style={{
						backgroundColor:"white",
						height: '100%',
						backgroundImage: `url("/assets/images/taxi-car.png")`,
						backgroundSize: '100% 100%',
						width: '815px',
					}}>
				</div>
				<div className="d-flex flex-column align-items-start justify-content-start h-100 flex-grow-1" style={{paddingTop:"150px"}}>
          <h2 className='sc-heading text-uppercase fw-bold' style={{fontSize:"50px"}}>welcome to</h2>
          <h1 className='sc-heading text-uppercase fw-bold' style={{fontSize:"110px"}}>share car</h1>
          <div className='d-flex justify-content-end' style={{width:"666px"}}>
            <h3 className='sc-heading text-uppercase fw-bold' style={{fontSize:"30px",width:"550px",textAlign: 'right'}}>An application that helps you share rides with others</h3>
          </div>
				</div>
			</div>
		</div>
	);
}
