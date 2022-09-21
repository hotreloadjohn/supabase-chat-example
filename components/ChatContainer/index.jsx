import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import ChatInput from "./ChatInput";
import Header from "./Header";
import Message from "./Message";

const ChatContainer = () => {
  const [thisMessages, setThisMessages] = useState([]);
  const { state, dispatch } = useChat();

  const [search, setSearch] = useState("");

  const user = false;
  const messages = true;
  const connectionId = false;
  const show = true;
  const reply = false;

  const searchMessage = (value) => {
    setSearch(value);
  };

  const sendMessage = async (value) => {
    if (!value) {
      return false;
    }
    const { error } = await supabaseClient
      .from("messages")
      .insert({ content: value, room_id: state.selectedRoomId?.id });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex-1">
      {state.selectedRoomId?.id ? (
        <div className="flex h-full flex-col relative">
          <Header searchMessage={searchMessage} />

          {/* messages container */}
          <div className=" max-h-80	flex flex-col p-6 pb-1 overflow-x-hidden overflow-y-auto scrollbar-border scrollbar-current scrollbar-thumb-transparent">
            {/* message */}
            {state.conversations[state.selectedRoomId?.id] &&
              state.conversations[state.selectedRoomId?.id]
                .filter(
                  (msg) =>
                    !msg.content.toLowerCase().indexOf(search.toLowerCase()) ||
                    search === ""
                )
                .map((message, i) => (
                  <Message
                    key={i}
                    message={message}
                    i={i}
                    thisMessages={state.conversations[state.selectedRoomId.id]}
                  />
                ))}
          </div>

          {/* chat input */}
          <ChatInput sendMessage={sendMessage} />
        </div>
      ) : (
        // <Welcome />
        <h1>Welcome screen</h1>
      )}
    </div>
  );
};

export default ChatContainer;
