import React from 'react';

export default function ButtonComponent(props) {
	return (
		<button
			onClick={props.onClick}
			className={`btn sc-blue-pale border-0 rounded-pill text-uppercase fw-bold ${props.className?props.className:""} ${props.btnType?props.btnType:"btn-info"}`}
			style={{ color: 'white', width: '100%', height: '50px' }}>
			{props.label}
		</button>
	);
}
