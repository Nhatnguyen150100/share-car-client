import { createSlice } from '@reduxjs/toolkit';

export const CitySlice = createSlice({
	name: 'city',
	initialState: {
		data: [],
	},
	reducers: {
		setDataCity: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setDataCity } = CitySlice.actions;

export default CitySlice.reducer;
