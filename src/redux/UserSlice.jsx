import { createSlice } from '@reduxjs/toolkit';

export const UserSlice = createSlice({
	name: 'user',
	initialState: {
		data: {},
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setData } = UserSlice.actions;

export default UserSlice.reducer;
