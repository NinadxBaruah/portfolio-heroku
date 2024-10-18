import { useUserDetailsContext } from "../utils/UserDetailsContext";

interface MessagesType {
  id: string;
  message: string;
  name: string;
  picture: string;
  timeStamp: string;
  handleInbox: (id: string, name: string, image: string) => Promise<void>;
  isNewMessage: boolean; // New prop to track if the message is new
}

export function Messages({
  id,
  message,
  name,
  picture,
  timeStamp,
  handleInbox,
  isNewMessage, // Destructure the new prop
}: MessagesType) {
  const { userDetails } = useUserDetailsContext();

  function handleClick(id: string, name: string, image: string) {
    handleInbox(id, name, image);
  }

  return (
    <div
      onClick={() => handleClick(id, name, picture)}
      className="w-full pt-3 pb-3 pl-3 cursor-pointer flex hover:bg-gray-200 transition-colors duration-300"
    >
      <img className="w-12 rounded-full mr-2" src={picture} />
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center">
          <span>{name}</span>

          {/* Display green dot if new message */}
          {isNewMessage && (
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          )}

          <span className="mr-7">
            {new Date(timeStamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <span>
          {userDetails.user_id === id ? `You: ${message}` : message}
        </span>
      </div>
    </div>
  );
}
