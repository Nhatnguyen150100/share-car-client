import { publicKey } from "../common/Commom";

const baseURL = 'https://share-car-api.onrender.com';
const MAP_BOX_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const MAP_BOX_DIRECTIONS = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/';

export function postToServer(url, bodyObject) {
	return new Promise((resolve, reject) =>
		fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject),
		})
			.then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				if (response.ok) {
					const contentType = response.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1)
						response.json().then((json) => resolve(json));
					else response.text().then((text) => resolve(text));
				} else response.json().then((text) => reject(text));
			})
			.catch((err) => reject(err)),
	);
}

export function postToServerWithToken(url ,bodyObject, token) {
	return new Promise((resolve, reject) =>
		fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}` },
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject),
		})
			.then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				if (response.ok) {
					const contentType = response.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1)
						response.json().then((json) => resolve(json));
					else response.text().then((text) => resolve(text));
				} else response.json().then((text) => reject(text));
			})
			.catch((err) => reject(err)),
	);
}

export function callToServerWithTokenAndUser(method,url, user ,bodyObject, token) {
	return new Promise((resolve, reject) =>
		fetch(baseURL + url, {
			method: method,
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}` },
			credentials: 'same-origin',
			user: user,
			body: JSON.stringify(bodyObject),
		}).then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				// if(response.status === 400) response.json().then((json) => resolve(json))
				if (response.ok) {
					const contentType = response.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1)
						response.json().then((json) => resolve(json));
					else response.json().then((json) => resolve(json));
				} else response.json().then((json) => reject(json));
			})
			.catch((err) => reject(err)),
	);
}

export function callToServerWithTokenAndUserObject(method,url, userObject ,bodyObject, token) {
	return new Promise((resolve, reject) =>
		fetch(baseURL + url, {
			method: method,
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}` },
			credentials: 'same-origin',
			user: JSON.stringify(userObject),
			body: JSON.stringify(bodyObject),
		}).then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				// if(response.status === 400) response.json().then((json) => resolve(json))
				if (response.ok) {
					const contentType = response.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1)
						response.json().then((json) => resolve(json));
					else response.json().then((json) => resolve(json));
				} else response.json().then((json) => reject(json));
			})
			.catch((err) => reject(err)),
	);
}

export function getToServerWithTokenAndUserObject(url, userObject, token) {
	return new Promise((resolve, reject) =>
		fetch(baseURL + url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}` },
			credentials: 'same-origin',
			user: JSON.stringify(userObject),
		}).then((response) => {
				if (response.status === 419) {
					alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
					window.location.reload();
				}
				// if(response.status === 400) response.json().then((json) => resolve(json))
				if (response.ok) {
					const contentType = response.headers.get('content-type');
					if (contentType && contentType.indexOf('application/json') !== -1)
						response.json().then((json) => resolve(json));
					else response.json().then((json) => resolve(json));
				} else response.json().then((json) => reject(json));
			})
			.catch((err) => reject(err)),
	);
}

export function getDirections(longitudeStart,latitudeStart,longitudeEnd,latitudeEnd){
	return new Promise((resolve, reject) =>
	fetch(`${MAP_BOX_DIRECTIONS}${longitudeStart},${latitudeStart};${longitudeEnd},${latitudeEnd}?geometries=geojson&access_token=${publicKey}`, {
		method: 'get',
		headers: { 'Content-Type': 'application/json'},
		credentials: 'same-origin',
	}).then((response) => {
			if (response.status === 419) {
				alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
				window.location.reload();
			}
			// if(response.status === 400) response.json().then((json) => resolve(json))
			if (response.ok) {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.indexOf('application/json') !== -1)
					response.json().then((json) => resolve(json));
				else response.json().then((json) => resolve(json));
			} else response.json().then((json) => reject(json));
		})
		.catch((err) => reject(err)),
);
}

export function getLocationOnReverseGeocoding(longitude,latitude){
	return new Promise((resolve, reject) =>
	fetch(MAP_BOX_URL + longitude + ',' + latitude +`.json?access_token=${publicKey}`, {
		method: 'get',
		headers: { 'Content-Type': 'application/json'},
		credentials: 'same-origin',
	}).then((response) => {
			if (response.status === 419) {
				alert('Your session is already expired because you are idle for too long. Page will automatic refesh.');
				window.location.reload();
			}
			// if(response.status === 400) response.json().then((json) => resolve(json))
			if (response.ok) {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.indexOf('application/json') !== -1)
					response.json().then((json) => resolve(json));
				else response.json().then((json) => resolve(json));
			} else response.json().then((json) => reject(json));
		})
		.catch((err) => reject(err)),
);
}


