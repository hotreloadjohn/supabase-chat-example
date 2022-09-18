import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import ChatInput from "./ChatInput";
import Header from "./Header";
import Message from "./Message";

const ChatContainer = () => {
  const [thisMessages, setThisMessages] = useState([]);
  const { state, dispatch } = useChat();
  let selectedRoomId = state.selectedRoomId?.id;

  const [search, setSearch] = useState("");

  const user = false;
  const chatUser = true;
  const messages = true;
  const connectionId = false;
  const show = true;
  const reply = false;

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabaseClient
        .from("messages")
        .select("*, profile: profiles(id, username)")
        .match({ room_id: selectedRoomId })
        .order("created_at");

      if (!data) {
        // alert("no data");
        return;
      }

      // const newProfiles = Object.fromEntries(
      //   data
      //     .map((message) => message.profile)
      //     .filter(Boolean) // is truthy
      //     .map((profile) => [profile!.id, profile!])
      // )

      // setProfileCache((current) => ({
      //   ...current,
      //   ...newProfiles,
      // }))
      console.log(data);
      setThisMessages(data);
    };

    getData();
  }, [selectedRoomId]);

  const searchMessage = (value) => {
    setSearch(value);
  };

  const sendMessage = async (value) => {
    if (!value) {
      return false;
    }
    console.log(value);
    const { error } = await supabaseClient
      .from("messages")
      .insert({ content: value, room_id: selectedRoomId });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex-1">
      {chatUser ? (
        <div className="flex h-full flex-col relative">
          <Header searchMessage={searchMessage} />

          {/* messages container */}
          <div className=" max-h-80	flex flex-col p-6 pb-1 overflow-x-hidden overflow-y-auto scrollbar-border scrollbar-current scrollbar-thumb-transparent">
            {/* message */}
            {thisMessages &&
              thisMessages
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
                    thisMessages={thisMessages}
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
