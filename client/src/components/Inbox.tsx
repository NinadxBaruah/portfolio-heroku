import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useUserDetailsContext } from "../utils/UserDetailsContext";
import { useMessageContext } from "../utils/MessagesContext";
import Cookies from "js-cookie";
import { useSocket } from "../utils/useSocket";

interface InboxType {
  id?: string;
  name?: string;
  image?: string;
  setShowInbox?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeftHomePage?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface MessageType {
  id: string;
  message: string;
  name?: string;
  picture?: string;
  timeStamp: string; // Ensure it's a string representing a date
}

// interface ResponseMessageType {
//   id: string;
//   isSender: boolean;
//   message: string;
//   timeStamp: string;
// }
export const Inbox: React.FC<InboxType> = ({
  id,
  name,
  image,
  setShowInbox,
  setShowLeftHomePage,
}) => {
  const navigate = useNavigate();
  const inputValue = useRef<HTMLInputElement | null>(null);
  const { userDetails } = useUserDetailsContext();
  const [allMessagesToSet, setAllMessagesToSet] = useState<MessageType[]>([
    {
      id: "",
      message: "",
      name: "",
      timeStamp: "",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const { setProfileMessages, allMessages, setAllMessages } =
    useMessageContext();
  const { socket } = useSocket();
  async function handleGoBack() {
    navigate("/");
    if (setShowInbox) setShowInbox(false);
    if (setShowLeftHomePage) setShowLeftHomePage(true);
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessagesToSet]);

  useEffect(() => {
    const messagesArray = [];
    if (id) {
      for (const key in allMessages) {
        if (key == id) {
          messagesArray.push(...allMessages[key]);
        }
      }
    }

    messagesArray.sort(
      (a: MessageType, b: MessageType) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    setAllMessagesToSet(messagesArray);
  }, [allMessages]);

  useEffect(() => {
    // Initialize audio element
    notificationSound.current = new Audio("/mp3/send.mp3");
    notificationSound.current.load(); // Pre-load the audio
  }, []);

  if (socket)
    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log("message recieved");
      if (messageData.type == "receive") {
        const messagesToSave: MessageType = {
          id: messageData.from,
          message: messageData.message,
          name: name || "",
          timeStamp: messageData.timestamp,
        };

        setAllMessages((prev) => {
          const newState = { ...prev };
          if (messagesToSave.id && newState[id || ""]) {
            newState[id || ""] = [...newState[id || ""], messagesToSave];
          } else if (id) {
            newState[id] = [messagesToSave];
          }
          return newState;
        });

        setAllMessages((prev) => {
          const newState = { ...prev };

          for (const key in newState) {
            // Assuming the message objects have a 'timeStamp' property
            newState[key] = newState[key].sort((a, b) => {
              const dateA = new Date(a.timeStamp);
              const dateB = new Date(b.timeStamp);
              return dateB.getTime() - dateA.getTime(); // Sort in descending order
            });
          }

          return newState;
        });

        setProfileMessages((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                message: messageData.message,
                timeStamp: new Date().toISOString(),
              };
            }
            return item;
          })
        );

        // setAllMessages(messagesArray)
      }
    };

  const playNotificationSound = async () => {
    try {
      if (notificationSound.current) {
        // Reset the audio to the beginning
        notificationSound.current.currentTime = 0;
        await notificationSound.current.play();
      }
    } catch (error) {
      console.log(
        "Notification sound failed to play - user may need to interact with the page first"
      );
    }
  };

  async function handleOnSend() {
    const inputElement = inputValue.current;
    if (!inputElement?.value) return;

    const messageValue = inputElement.value;

    try {
      const response = await fetch(
        `/projects/chat-app/api/v1/search/user/send/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "send",
            message: messageValue,
            recieverId: id,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
      if (response.ok) {
        // Creating a new message object
        const newMessage: MessageType = {
          id: userDetails.user_id, // Your user's ID
          message: messageValue, // The message content
          name: userDetails.name || "", // The sender's name
          timeStamp: new Date().toISOString(), // Current timestamp in ISO format
        };

        // setProfileMessages((prev) =>
        //   prev.map((item) => {
        //     if (item.id === id) {
        //       return {
        //         ...item,
        //         message: messageValue,
        //         timeStamp: new Date().toISOString(),
        //       };
        //     }
        //     return item;
        //   })
        // );
        setProfileMessages((prev) => {
          const existingItem = prev.find((item) => item.id === id);

          if (existingItem) {
            // Update the existing message
            return prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    message: messageValue,
                    timeStamp: new Date().toISOString(),
                  }
                : item
            );
          } else {
            // Add the new message if it doesn't exist
            return [
              ...prev,
              {
                id: id || "",
                message: messageValue,
                name: name || "",
                picture: image || "", // Ensure 'picture' is included
                timeStamp: new Date().toISOString(),
              },
            ];
          }
        });

        // setAllMessagesToSet((prev = []) => [...prev, newMessage]);

        setAllMessages((prev) => {
          const newState = { ...prev }; // Create a copy of the previous state
          if (id && newState[id]) {
            // Check if the conversation thread exists
            newState[id] = [...newState[id], newMessage]; // Add new message to the thread
          } else if (id) {
            newState[id] = [newMessage]; // Create a new thread if it doesn't exist
          }
          return newState;
        });
        console.log("after send message: ", allMessages);
        if (socket)
          socket.send(
            JSON.stringify({
              type: "send",
              name: name,
              sendTo: id,
              message: messageValue,
            })
          );
        playNotificationSound();
      }
      const data = await response.json();
      const userInfo = Cookies.get("userInfo");
      if (!userInfo) throw new Error("User info not found");

      const parsedData = JSON.parse(userInfo);
      const messagesArr: MessageType[] = parsedData.messages || [];

      const newMsg: MessageType = {
        id: id || "",
        message: messageValue,
        name: name || "",
        picture: image || "",
        timeStamp: new Date().toISOString(),
      };

      const updatedMessages = [newMsg, ...messagesArr]
        .sort(
          (a, b) =>
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
        )
        .filter(
          (message, index, self) =>
            index === self.findIndex((t) => t.id === message.id)
        );

      const updatedUserInfo = {
        ...parsedData,
        messages: updatedMessages,
      };

      Cookies.set("userInfo", JSON.stringify(updatedUserInfo));
      console.log(data);

      // Clear the input after sending the message
      inputElement.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
      // Here you might want to show an error message to the user
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      {/* Header with back arrow */}
      <div className="flex items-center p-4 shadow bg-white">
        <IoMdArrowRoundBack
          onClick={handleGoBack}
          size={28}
          className="cursor-pointer hover:text-gray-600 transition-colors"
        />
        <img
          src={image}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-full ml-4"
        />
        <h1 className="ml-4 text-lg font-semibold text-gray-800">{name}</h1>
      </div>

      {/* Chat area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {allMessagesToSet?.length ? (
          allMessagesToSet.map((item) => {
            if (item.id === userDetails.user_id) {
              // Corrected the equality check
              return (
                <div
                  key={`${item.id}-${item.timeStamp}`}
                  className="flex justify-end mb-4"
                >
                  <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <span className="font-semibold text-sm sm:text-base md:text-lg">
                      {item.name}
                    </span>
                    <div className="text-sm sm:text-base md:text-lg">
                      {item.message}
                    </div>
                    <span className="text-xs sm:text-sm text-right block mt-1">
                      {new Date(item.timeStamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`${item.id}-${item.timeStamp}`}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-gray-200 p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <span className="font-semibold text-sm sm:text-base md:text-lg">
                      {item.name}
                    </span>
                    <div className="text-sm sm:text-base md:text-lg">
                      {item.message}
                    </div>
                    <span className="text-xs sm:text-sm text-right block mt-1">
                      {new Date(item.timeStamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message input area */}
      <div className="p-4 flex items-center border-t bg-white">
        <input
          type="text"
          ref={inputValue}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <IoMdSend onClick={handleOnSend} size={24} />
        </button>
      </div>
    </div>
  );
};
