import { createSlice } from '@reduxjs/toolkit'



export const userSlice = createSlice({
    name: 'user',
    initialState: {
      user1:null,
    },
    reducers: {
     setUserDetails : (state,action)=>{
        //its a function 
        state.user1=action.payload
     },
     logout: (state) => {
        state.user1 = null;
     }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setUserDetails, logout }=userSlice.actions
  export default userSlice.reducer
