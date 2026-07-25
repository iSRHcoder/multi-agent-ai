import { signInWithPopup } from 'firebase/auth';
import backendApi from '../../utils/axios';
import { auth, provider } from '../../utils/firebase';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ArtEffect from '../components/ArtEffect';
import ChatArea from '../components/ChatArea';

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
    <div className="flex h-screen overflow-hidden bg-[#0d0f14] text-white">
      <SideBar />
      <ChatArea />
      <ArtEffect />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex w-85 flex-col gap-5 rounded-2xl border border-white/8 bg-[#13151c] p-7">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold tracking-tight text-slate-100">
                Welcome to CortexAI
              </h2>
              <p className="text-[13px] text-slate-500">Please login to continue using the app.</p>
              <button
                className="m-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-400 bg-white px-3 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-200 hover:shadow-md active:bg-gray-400"
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
