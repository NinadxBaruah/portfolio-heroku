import React from "react";
import { useAuth } from "../utils/AuthContext";
import { useUserDetailsContext } from "../utils/UserDetailsContext";

interface MenuItemTypes {
  profile: boolean;
  addFriends: boolean;
  notifications: boolean;
}


interface MenuProps {
  setShowMenuItems: React.Dispatch<React.SetStateAction<MenuItemTypes>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeftHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}


export const Menu: React.FC<MenuProps> = ({
  setShowMenuItems,
  setShowMenu,
  setShowLeftHomePage
}) => {
  const { logout } = useAuth();
  const { userDetails } =
    useUserDetailsContext();

  // const [friendRequests, setFriendRequets] = useState<FriendRequestSender[]>([]);

  // useEffect(() => {
  //   setFriendRequets(userDetails.FriendRequestSenders);
  // }, [userDetails.FriendRequestSenders]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetchUserData();
  //     await fetchFriendRequests();
  //     // setIsLoading(false);
  //     // return () =>{
  //     //   sessionStorage.clear();
  //     // }
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      {/* {console.log(friendRequests)} */}
      {/* {console.log(userDetails)} */}
      <div className="flex flex-col select-none absolute z-20 bg-white border border-gray-300 shadow-lg rounded-lg w-[40%] top-12 left-2">
        <span
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700 transition-all duration-200"
          onClick={() => {
            setShowMenu(false);
            setShowMenuItems((prevState) => ({
              ...prevState,
              profile: true,
              addFriends: false,
              notifications:false
            }));
            setShowLeftHomePage(false)
          }}
        >
          Profile
        </span>
        <span
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700 transition-all duration-200"
          onClick={() => {
            setShowMenu(false);
            setShowMenuItems((prevState) => ({
              ...prevState,
              profile: false,
              addFriends: true,
              notifications:false
            }));
            setShowLeftHomePage(false)
          }}
        >
          Add Friends
        </span>
        <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 font-medium text-gray-700 transition-all duration-200">
          <span
            onClick={() => {
              setShowMenu(false);
              setShowMenuItems({
                profile: false,
                addFriends: false,
                notifications:true,
              });
            setShowLeftHomePage(false)
            }}
          >
            Notifications
          </span>
          {userDetails.FriendRequestSenders?.length ? (
            <span className="bg-red-600 text-white text-xs font-bold py-1 px-[0.6rem] rounded-full">
              {userDetails.FriendRequestSenders.length}
            </span>
          ) : (
            <span className="text-gray-400 text-xs font-bold">0</span>
          )}
        </div>
        <span
          onClick={logout}
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-red-500 transition-all duration-200"
        >
          Logout
        </span>
      </div>
    </>
  );
};
