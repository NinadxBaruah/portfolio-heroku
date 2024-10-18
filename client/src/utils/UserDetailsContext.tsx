import { useContext, createContext, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

interface FriendRequestSender {
  id: string;
  name: string;
  image: string;
}

interface Friend {
  id: string;
  name: string;
  bio: string;
  image: string;
}
interface MessagesType {
  id: string;
  message: string;
  name: string;
  picture: string;
  timeStamp: string;
}

interface UserDetails {
  user_id:string,
  name: string;
  image: string;
  bio?: string;
  FriendRequestSenders: FriendRequestSender[];
  friendsList: Friend[];
  messages: MessagesType[];
}
interface UserContextType {
  userDetails: UserDetails;
  fetchUserData: () => Promise<void>;
  setBio: (bio: string) => void;
  fetchFriendRequests: () => Promise<void>;
  // fetchUserMessages: () => Promise<void>;
}

interface UserDetailsProp {
  children: React.ReactNode;
}

const UserDetailsContext = createContext<UserContextType>({
  userDetails: {
    user_id:"",
    name: "",
    image: "",
    bio: "",
    FriendRequestSenders: [],
    friendsList: [],
    messages: [],
  },
  fetchUserData: async () => {},
  // @ts-ignore
  setBio: (bio: string) => {},
  fetchFriendRequests: async () => {},
  // fetchUserMessages: async () => {},
});

export const UserDetailsProvider = ({ children }: UserDetailsProp) => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    user_id:"",
    name: "",
    image: "",
    bio: "",
    FriendRequestSenders: [],
    friendsList: [],
    messages: [],
  });

  const fetchUserData = async () => {
    // Fetch user data if not already present
    const data: string | undefined = Cookies.get("userInfo");
    if (!data) {
      try {
        console.log("making api rq to fecth user data");
        const response = await fetch(
          `/projects/chat-app/api/v1/search/user/profile`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          Cookies.set("userInfo", JSON.stringify(userData), { expires: 1 });
          setUserDetails((prev) => ({
            ...prev,
            user_id:userData.id,
            name: userData.name,
            image: userData.image,
            bio: userData?.bio,
            friendsList: userData.friendsList || [],
          }));
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else if (data) {
      const userInfo = JSON.parse(data);
      setUserDetails({
        user_id:userInfo.id,
        name: userInfo.name,
        image: userInfo.image,
        bio: userInfo?.bio,
        friendsList: userInfo.friendsList || [],
        FriendRequestSenders: userInfo?.FriendRequestSenders || [],
        messages: userInfo?.messages || null,
      });
    } else {
      console.log("User details already present");
    }
  };

  // async function fetchUserMessages() {
  //   console.log("insdie fetchUserMessages");
  //   const hasFetchedFriendRequests = sessionStorage.getItem("__userMessages");
  //   const data: string | undefined = Cookies.get("userInfo");
  //   if (!hasFetchedFriendRequests) {
  //     try {
  //       fetch(
  //         `${import.meta.env.VITE_APP_HOST_PROTOCOL}${
  //           import.meta.env.VITE_APP_BACKEND_URL
  //         }/api/v1/search/user/send/message`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             type: "allMessages",
  //           }),
  //           credentials: "include",
  //         }
  //       )
  //         .then(async (response) => {
  //           // Log the raw response to inspect the content
  //           const data = await response.json();
  //           setUserDetails((prev) => {
  //             return {
  //               ...prev,
  //               messages: data.mergedData,
  //             };
  //           });
  //           console.log(data)
  //           const userInfo = Cookies.get("userInfo");
  //           if (userInfo) {
  //             const userData = JSON.parse(userInfo);
  //             const newUSerData = {
  //               ...userData,
  //               messages: data.mergedData,
  //             };

  //             Cookies.set("userInfo", JSON.stringify(newUSerData), {
  //               expires: 1,
  //             });
  //           }
  //           sessionStorage.setItem("__userMessages" , 'true')
  //         })
  //         .catch((err) => console.log("Fetch error:", err));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   fetchUserData();
  // }, [fetchUserData]);

  const fetchFriendRequests = async () => {
    const hasFetchedFriendRequests = sessionStorage.getItem(
      "friendRequestsFetched"
    );
    // sessionStorage.removeItem("friendRequestsFetched");
    if (hasFetchedFriendRequests) {
      console.log(
        "Friend requests have already been fetched for this session."
      );
      return; // Exit early if the data has already been fetched in this session
    }

    try {
      const response = await fetch(
        `/projects/chat-app/api/v1/search/user/friend-requests`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserDetails((prev) => ({
          ...prev,
          FriendRequestSenders: data.senderInfos,
        }));
        console.log(data);

        // Set session storage flag to prevent further API calls during the same session
        sessionStorage.setItem("friendRequestsFetched", "true");
      }
    } catch (err) {
      console.log(
        `${import.meta.env.VITE_APP_HOST_PROTOCOL}${
          import.meta.env.VITE_APP_BACKEND_URL
        }/v1/search/user/friend-requests`
      );
      const { logout } = useAuth();
      logout();
      console.log(err);
    }
  };

  const setBio = (bio: string) => {
    const dataFromCookie = Cookies.get("userInfo");
    if (dataFromCookie) {
      const UserInfo = JSON.parse(dataFromCookie);
      UserInfo.bio = bio;
      const setUserInfo = JSON.stringify(UserInfo);
      Cookies.set("userInfo", setUserInfo, { expires: 1 });
    }
  };

  return (
    <UserDetailsContext.Provider
      value={{
        userDetails,
        fetchUserData,
        setBio,
        fetchFriendRequests,
        // fetchUserMessages,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetailsContext = () => {
  return useContext(UserDetailsContext);
};
