import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUserDetailsContext } from "../utils/UserDetailsContext";
import { useState } from "react";
import Cookies from "js-cookie";

interface MenuItems {
  profile: boolean;
  addFriends: boolean;
  notifications: boolean;
}

interface NotificationsProps {
  setShowMenuItems?: React.Dispatch<React.SetStateAction<MenuItems>>;
  setShowLeftHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

interface friendRequestType {
  id: string;
  name: string;
  image: string;
}

export const Notifications = ({
  setShowMenuItems,
  setShowLeftHomePage,
}: NotificationsProps) => {
  const navigate = useNavigate();
  const { userDetails } = useUserDetailsContext();
  const [friendRequests, setFriendRequests] = useState(
    userDetails.FriendRequestSenders
  );
  const {setUserDetails} = useUserDetailsContext();
  const handleGoBack = () => {
    if (setShowMenuItems) {
      setShowMenuItems((prevState) => ({
        ...prevState,
        notifications: false,
      }));
      setShowLeftHomePage(true);
    }
    navigate("/projects/chat-app");
  };

  const handleAccept = async (id: string , name: string , image: string) => {
    try {
      const response = await fetch(
        `/projects/chat-app/api/v1/search/user/send/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Origin': `${import.meta.env.VITE_APP_ORIGIN}`
          },
          body: JSON.stringify({ type: "accept", recipientId: id }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Friend request accepted", data);
        setFriendRequests((prev) => prev.filter((sender) => sender.id != id));
        setUserDetails((prev) => ({
          ...prev,
          friendsList: [...prev.friendsList , {id: id , name:name , image:image }]
        }))

        const userInfo = Cookies.get("userInfo")
        if(userInfo) {
          const userInfoData = JSON.parse(userInfo)
          userInfoData.friendsList.push({id: id , name:name , image:image })
          Cookies.set("userInfo" , JSON.stringify(userInfoData));
          console.log
        }
        // console.log(userDetails)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <IoMdArrowRoundBack
        onClick={handleGoBack}
        size={24}
        className="self-start mt-2 ml-2 cursor-pointer hover:text-gray-600 transition-colors"
      />
      <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-center text-2xl font-semibold mb-4">
          Notifications
        </h1>

        {friendRequests.length > 0 ? (
          <ul className="space-y-2">
            {friendRequests.map((sender: friendRequestType) => (
              <li
                key={sender.id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={sender.image}
                    alt={`${sender.name}'s profile`}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{sender.name}</span>
                </div>
                <button
                  onClick={() => handleAccept(sender.id , sender.name , sender.image)}
                  className="text-blue-500"
                >
                  Accept
                </button>{" "}
                {/* You can add more actions here */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No notifications.</p>
        )}
      </div>
    </>
  );
};
