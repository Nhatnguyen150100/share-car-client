import { createSlice } from '@reduxjs/toolkit';

export const TripDetailSlice = createSlice({
	name: 'trip',
	initialState: {
		data: {},
		downLocationData:{}
	},
	reducers: {
		setDataTrip: (state, action) => {
			state.data = action.payload;
		},
		setDownLocationData: (state, action) => {
			state.downLocationData = action.payload;
		}
	},
});

export const { setDataTrip, setDownLocationData } = TripDetailSlice.actions;

export default TripDetailSlice.reducer;
