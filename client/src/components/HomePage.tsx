import{ useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { HomePageLeftSide } from "./HomePageLeftSide";
import { Profile } from "./Profile";
import { AddFriends } from "./AddFriends";
import { Notifications } from "./Notifications";
import { Inbox } from "./Inbox";


interface MenuItemTypes {
  profile: boolean;
  addFriends: boolean;
  notifications: boolean;
}
interface InboxType {
  id?:string;
  name?:string;
  image?:string
}

export function HomePage() {
  const { isLoggedIn , MenuRemove } = useAuth();
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showLeftHomePage, setShowLeftHomePage] = useState(true);
  const [showInbox , setShowInbox] = useState(false)
  const [inboxItems , setInboxItems] = useState<InboxType>({})
  const [showMenuItems, setShowMenuItems] = useState<MenuItemTypes>({
    profile: false,
    addFriends: false,
    notifications: false,
  });
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("friendRequestsFetched");
    sessionStorage.removeItem("__userMessages");
    sessionStorage.removeItem("__friendList")
  });
  
  async function handleInbox(id:string , name:string , image:string){
    setInboxItems({
      id:id ,
      name:name,
      image:image
    })
    console.log("call")
    setShowLeftHomePage(false)
    setShowInbox(true)
  }

  useEffect(() =>{
    MenuRemove(setShowMenu)
  },[])
 
  return (
    <div className="w-full flex">
      <div className="w-full h-[100dvh] relative md:w-[40%] md:max-h-[100vh] scrollbar-hidden hover:scrollbar-auto md:overflow-y-auto">
        {showMenuItems.profile && (
          <div>
            <Profile
              setShowMenuItems={setShowMenuItems}
              setShowLeftHomePage={setShowLeftHomePage}
            />
          </div>
        )}
        {showMenuItems.addFriends && (
          <AddFriends
            setShowMenuItems={setShowMenuItems}
            setShowLeftHomePage={setShowLeftHomePage}
          />
        )}
        {showMenuItems.notifications && (
          <Notifications
            setShowMenuItems={setShowMenuItems}
            setShowLeftHomePage={setShowLeftHomePage}
          />
        )}
        {showInbox && <Inbox id={inboxItems?.id} name={inboxItems?.name} image={inboxItems?.image}
        setShowLeftHomePage={setShowLeftHomePage} setShowInbox={setShowInbox}
        />}
        {showLeftHomePage &&
          !showMenuItems.profile &&
          !showMenuItems.addFriends &&
          !showMenuItems.notifications && (
            <HomePageLeftSide
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isLoggedIn={isLoggedIn}
              showAddUser={showAddUser}
              setShowAddUser={setShowAddUser}
              setShowMenuItems={setShowMenuItems}
              setShowLeftHomePage={setShowLeftHomePage}
              handleInbox={handleInbox}
            />
          )}
      </div>
      <div className="hidden md:block md:w-[60%] md:h-[100dvh] bg-main-page-background bg-gradient-to-r from-[#D2D78D] via-[#D0D8B5] to-[#84B289]"></div>
    </div>
  );
}
