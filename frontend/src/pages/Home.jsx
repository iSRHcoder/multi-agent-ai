import { signInWithPopup } from 'firebase/auth';
import backendApi from '../../utils/axios';
import { auth, provider } from '../../utils/firebase';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log('userData:', userData);

  const handleLogin = async (token) => {
    try {
      const { data } = await backendApi.post('/api/auth/login', { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.log(`error : ${error}`);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, provider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
    console.log('data:', data);
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to CortexAI
              </h2>
              <p className="text-[13px] text-slate-500 ">Please login to continue using the app.</p>
              <button
                className="w-full flex items-center justify-center gap-3 py-2 px-3 m-2 rounded-full bg-white border border-gray-400 text-gray-800 text-lg font-medium shadow-sm hover:bg-gray-200 hover:shadow-md active:bg-gray-400 transition-all duration-200 cursor-pointer"
                onClick={googleLogin}
              >
                <FcGoogle size={30} />
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
