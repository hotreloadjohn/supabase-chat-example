import { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

const ExperimentalChatUI = () => {
  const [search, setSearch] = useState("");
  const { state, dispatch } = useChat();
  const [sellers, setSellers] = useState([]);
  const [selectedRoomMsgs, setselectedRoomMsgs] = useState();
  const [message, setMessage] = useState("");

  const { user } = useUser();

  const scrollRef = useRef();

  useEffect(() => {
    const createSellerList = async () => {
      const sellerTemp = await Promise.all(
        state.rooms.map(async (room) => {
          const { data } = await supabaseClient
            .from("profiles")
            .select("*")
            .match({ id: room.products.seller_id })
            .single();
          return {
            id: room.id,
            seller_name: data.username,
            seller_avatar: data.avatar_url,
            item_name: room.name,
            item_avatar: room.products.image_url,
          };
        })
      );
      setSellers(sellerTemp);
    };

    if (state.rooms) {
      createSellerList();
    }
  }, [state.rooms]);

  useEffect(() => {
    setselectedRoomMsgs(state.conversations[state.selectedRoomId]);
  }, [state.selectedRoomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [selectedRoomMsgs]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      // 👇️ your logic here value.trim()
      console.log("Enter key pressed ✅");
      const { error } = await supabaseClient
        .from("messages")
        .insert({ content: message.trim(), room_id: state.selectedRoomId });

      if (error) {
        alert(error.message);
      }

      setMessage("");
    }
  };

  return (
    <div className="flex grow">
      <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
        <div className="border-r border-gray-300 lg:col-span-1">
          <div className="mx-3 my-3">
            <div className="relative text-gray-600">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-300"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="search"
                className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                name="search"
                placeholder="Search"
                required
              />
            </div>
          </div>

          <ul className="overflow-auto h-[calc(100vh-10rem)]">
            <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
            <li>
              {sellers.map((seller) => {
                return (
                  <a
                    key={seller.id}
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_SELECTED_ROOM",
                        payload: seller.id,
                      })
                    }
                    className={`${
                      seller.id === state.selectedRoomId ? "bg-gray-100" : ""
                    } flex items-center px-3 py-2 text-sm 
                    transition duration-150 ease-in-out border-b 
                    border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none`}
                  >
                    <img
                      className="object-cover w-10 h-10 rounded-full"
                      src={seller.seller_avatar}
                      alt="username"
                    />
                    <div className="w-full pb-2">
                      <div className="flex justify-between">
                        <span className="block ml-2 font-semibold text-gray-600">
                          {seller.seller_name}
                        </span>
                        <span className="block ml-2 text-sm text-gray-600">
                          25 minutes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        {/* item name and last message */}
                        <div>
                          <span className="block ml-2 font-bold text-gray-600">
                            {seller.item_name}
                          </span>
                          <span className="block ml-2 text-sm text-gray-600">
                            Last message sent by user
                          </span>
                        </div>
                        {/* item image */}
                        <img
                          className="object-cover w-10 h-10 rounded-lg"
                          src={seller.item_avatar}
                          alt="item-url"
                        />
                      </div>
                    </div>
                  </a>
                );
              })}
            </li>
          </ul>
        </div>
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <img
                className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                alt="username"
              />
              <span className="block ml-2 font-bold text-gray-600">Emma</span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>

            <div
              ref={scrollRef}
              className="relative w-full p-6 overflow-y-auto h-[calc(100vh-14rem)]"
            >
              <ul className="space-y-2">
                {selectedRoomMsgs?.map((msg) => {
                  if (msg.profile_id === user.id) {
                    return (
                      <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                          <span className="block">{msg.content}</span>
                        </div>
                      </li>
                    );
                  } else {
                    return (
                      <li className="flex justify-start">
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                          <span className="block">{msg.content}</span>
                        </div>
                      </li>
                    );
                  }
                })}
                {/* <li className="flex justify-start">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                    <span className="block">Hi</span>
                  </div>
                </li>
                <li className="flex justify-end">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                    <span className="block">Hiiii</span>
                  </div>
                </li>
                <li className="flex justify-end">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                    <span className="block">how are you?</span>
                  </div>
                </li>
                <li className="flex justify-start">
                  <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                    <span className="block">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    </span>
                  </div>
                </li> */}
              </ul>
            </div>

            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Enter your message here..."
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message"
                value={message}
                required
                onKeyDown={handleKeyDown}
                onChange={(event) => setMessage(event.target.value)}
              />
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button type="submit">
                <svg
                  className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentalChatUI;
