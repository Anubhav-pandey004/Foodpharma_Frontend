
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Context from '../Context/context';

const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user1);
    const { fetchUserDetails } = useContext(Context);
    console.log("Current user is :",user);
    useEffect(() => {
      fetchUserDetails();
    }, []);
  return (
    <div>
      Home {
        console.log(user)
        
      }
    </div>
  )
}

export default Home
