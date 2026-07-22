import { useEffect } from 'react';
import './App.css';
import { getCurrentUser } from './features/getCurrentUser.js';
import Home from './pages/Home';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice.js';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();

      dispatch(setUserData(data));
    };
    getUser();
  }, [dispatch]);
  return <Home />;
};

export default App;
