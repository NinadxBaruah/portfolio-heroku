import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useUserDetailsContext } from "../utils/UserDetailsContext";



interface SearchUserProps {
  showAddUser: boolean;
  setShowAddUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeftHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  handleInboxes: (id: string, name: string, image: string) => Promise<void>;
}


const SearchUser: React.FC<SearchUserProps> = ({
  showAddUser,
  setShowAddUser,
  // setShowLeftHomePage,
  handleInboxes,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { userDetails, fetchUserData } = useUserDetailsContext();
  // const [selectedFriend, setSelectedFriend] = useState<Users | null>(null);
  // const [showInbox, setShowInbox] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);



  function handleClose() {
    setShowAddUser(false);
  }
  return (
    <>
      {/* {showInbox && selectedFriend && (
        <Inbox
          id={selectedFriend.id}
          name={selectedFriend.name}
          image={selectedFriend.image}
          setShowInbox={setShowInbox}
        />
      )} */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          showAddUser ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`relative w-[90%] max-w-lg h-[70%] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
        rounded-lg shadow-lg p-5 overflow-hidden transform transition-transform duration-300 ${
          showAddUser ? "scale-100" : "scale-95"
        }`}
        >
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 
            focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400"
              placeholder="Search by name..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IoIosCloseCircleOutline
              onClick={handleClose}
              className="ml-2 text-gray-600 dark:text-gray-300 cursor-pointer"
              size={25}
            />
          </div>

          <div className="flex-grow overflow-y-auto space-y-4">
            <>{console.log("from user search",userDetails.friendsList)}</>
            {userDetails.friendsList.length > 0 ? (
              userDetails.friendsList
                .filter((friend) =>
                  friend.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((friend) => (
                  <div
                    onClick={() => {
                      handleClose();
                      handleInboxes(friend.id, friend.name, friend.image);
                    }}
                    key={friend.id}
                    className="flex cursor-pointer items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src={friend.image}
                      alt={`${friend.name}'s profile`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {friend.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {friend?.bio?.slice(0, 25)}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No friends found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
