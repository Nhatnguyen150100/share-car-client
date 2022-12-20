import { createSlice } from '@reduxjs/toolkit';

export const TripDetailSlice = createSlice({
	name: 'trip',
	initialState: {
		data: {},
	},
	reducers: {
		setDataTrip: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setDataTrip } = TripDetailSlice.actions;

export default TripDetailSlice.reducer;
