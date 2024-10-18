import React, { useEffect, useState, useRef } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { Menu } from "./Menu";
import { Messages } from "./Messages";
import { LoginButton } from "./LoginButton";
import { SearchBox } from "./SearchBox";
import SearchUser from "./SearchUser";
import { IoIosAddCircle } from "react-icons/io";
import { useUserDetailsContext } from "../utils/UserDetailsContext";
import { useMessageContext } from "../utils/MessagesContext";
import { useSocket } from "../utils/useSocket";

interface MenuItemTypes {
  profile: boolean;
  addFriends: boolean;
  notifications: boolean;
}

interface HomePageLeftSideProps {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  showAddUser: boolean;
  setShowAddUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenuItems: React.Dispatch<React.SetStateAction<MenuItemTypes>>;
  setShowLeftHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  handleInbox: (id: string, name: string, image: string) => Promise<void>; 
}

interface MessagesType {
  id: string;
  message: string;
  name: string;
  picture: string;
  timeStamp: string;
}

export const HomePageLeftSide: React.FC<HomePageLeftSideProps> = ({
  showMenu,
  setShowMenu,
  isLoggedIn,
  showAddUser,
  setShowAddUser,
  setShowMenuItems,
  setShowLeftHomePage,
  handleInbox
}) => {
  const { fetchUserData, fetchFriendRequests } = useUserDetailsContext();
  const [messages, setMessages] = useState<MessagesType[] | null>(null);
  const {socket} = useSocket();
  const [newMessageIds, setNewMessageIds] = useState<string[]>([]);
  const {setAllMessages, setProfileMessages, profileMessages, fetchAllProfileMessages} = useMessageContext();
  
  // Create a ref for the audio element
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    notificationSound.current = new Audio('/mp3/recieve.mp3');
    notificationSound.current.load(); // Pre-load the audio
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchFriendRequests();
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchAllProfileMessages();
  }, []);

  useEffect(() => {
    if (profileMessages) {
      const sortedMessages = profileMessages.sort((a, b) => {
        return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
      });
      setMessages(sortedMessages);
    }
  }, [profileMessages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("___userMessages");
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Helper function to play notification sound
  const playNotificationSound = async () => {
    try {
      if (notificationSound.current) {
        // Reset the audio to the beginning
        notificationSound.current.currentTime = 0;
        await notificationSound.current.play();
      }
    } catch (error) {
      console.log('Notification sound failed to play - user may need to interact with the page first');
    }
  };

  if (socket) {
    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "receive") {
        const messagesToSave = {
          id: messageData.from,
          message: messageData.message,
          sender: messageData.sender,
          name: messageData.name,
          timeStamp: messageData.timestamp,
        };

        setAllMessages((prev) => {
          const newState = { ...prev };
          if (messagesToSave.id && newState[messageData.from || '']) {
            newState[messageData.from || ''] = [...newState[messageData.from || ''], messagesToSave];
          } else if (messageData.from) {
            newState[messageData.from] = [messagesToSave];
          }
          return newState;
        });

        setNewMessageIds((prevIds) => [...prevIds, messageData.from]);

        if (profileMessages.length === 0) {
          window.location.reload();
        }

        setAllMessages((prev) => {
          const newState = { ...prev };
          for (const key in newState) {
            newState[key] = newState[key].sort((a, b) => {
              const dateA = new Date(a.timeStamp);
              const dateB = new Date(b.timeStamp);
              return dateB.getTime() - dateA.getTime();
            });
          }
          return newState;
        });

        setProfileMessages((prev) =>
          prev.map((item) => {
            if (item.id === messageData.from) {
              return {
                ...item,
                message: messageData.message,
                timeStamp: new Date().toISOString(),
              };
            }
            return item;
          })
        );

        // Play notification sound
        playNotificationSound();
      }
    };
  }

  return (
    <div>
      {!showMenu ? (
        <CiMenuFries
          size={25}
          className="ml-2 mt-2 cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
      ) : (
        <IoMdClose
          size={25}
          className="ml-2 mt-2 cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
      )}

      {showMenu && (
        <Menu setShowMenuItems={setShowMenuItems} setShowMenu={setShowMenu} setShowLeftHomePage={setShowLeftHomePage}/>
      )}
      <SearchBox />
      {isLoggedIn ? (
        messages?.map((message) => {
          return (
            <Messages
              key={message.id}
              id={message.id}
              message={message.message}
              name={message.name}
              picture={message.picture}
              timeStamp={message.timeStamp}
              handleInbox={handleInbox}
              isNewMessage={newMessageIds.includes(message.id)} 
            />
          );
        })
      ) : (
        <LoginButton />
      )}
      {showAddUser && (
        <SearchUser 
          showAddUser={showAddUser} 
          setShowAddUser={setShowAddUser} 
          setShowLeftHomePage={setShowLeftHomePage} 
          handleInboxes={handleInbox}  
        />
      )}
      {isLoggedIn && (
        <IoIosAddCircle
          size={50}
          className="absolute bottom-0 right-0 mb-10 mr-10 cursor-pointer"
          onClick={() => setShowAddUser((prev) => !prev)}
        />
      )}
    </div>
  );
};