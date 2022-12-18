import { createSlice } from '@reduxjs/toolkit';

export const DriverSlice = createSlice({
	name: 'driver',
	initialState: {
		data: [],
	},
	reducers: {
		setDataDriver: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setDataDriver } = DriverSlice.actions;

export default DriverSlice.reducer;
