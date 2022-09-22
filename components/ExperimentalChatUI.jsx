import { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";

const ExperimentalChatUI = () => {
  const [search, setSearch] = useState("");
  const { state, dispatch } = useChat();
  const [sellers, setSellers] = useState([]); // You are buying
  const [buyers, setBuyers] = useState([]); // You are selling
  const [selectedRoomMsgs, setselectedRoomMsgs] = useState();
  const [message, setMessage] = useState("");

  const { user } = useUser();

  const scrollRef = useRef(null);

  // useEffect(() => {
  //   const createSellerList = async () => {
  //     const sellerTemp = await Promise.all(
  //       state.rooms.map(async (room) => {
  //         const { data } = await supabaseClient
  //           .from("profiles")
  //           .select("*")
  //           .match({ id: room.products?.seller_id })
  //           .single();
  //         return {
  //           id: room.id,
  //           seller_name: data.username,
  //           seller_avatar: data.avatar_url,
  //           item_name: room.name,
  //           item_avatar: room.products.image_url,
  //         };
  //       })
  //     );
  //     setSellers(sellerTemp);
  //   };

  //   if (state.rooms) {
  //     console.log(state.rooms);
  //     createSellerList();
  //   }
  // }, [state.rooms]);

  useEffect(() => {
    const createBuyerSellerList = async () => {
      console.log("Exp chatUI", state.rooms);
      const sellerListTemp = await Promise.all(
        state.rooms
          .filter((room) => room.products.seller_id !== user.id)
          .map(async (room) => {
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

      const buyerListTemp = await Promise.all(
        state.rooms
          .filter((room) => room.buyer_id !== user.id)
          .map(async (room) => {
            const { data } = await supabaseClient
              .from("profiles")
              .select("*")
              .match({ id: room.buyer_id })
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

      setBuyers(buyerListTemp);
      setSellers(sellerListTemp);
    };

    if (state.rooms) {
      createBuyerSellerList();
    }
  }, [state.rooms]);

  useEffect(() => {
    setselectedRoomMsgs(
      state.conversations[state.selectedRoom?.selected_chatUserId]
    );

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.selectedRoom?.selected_chatUserId, state.conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedRoomMsgs]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      // 👇️ your logic here value.trim()
      console.log("Enter key pressed ✅");

      console.log(state.selectedRoom.selected_sellerId);
      const { error } = await supabaseClient.from("messages").insert({
        content: message.trim(),
        room_id: state.selectedRoom.selected_chatUserId,
      });

      if (error) {
        alert(error.message);
      }

      setMessage("");
    }
  };

  const handleSearchChange = (e) => {
    console.log(e.key);
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onKeyDown={handleSearchChange}
              />
            </div>
          </div>

          <ul className="overflow-auto h-[calc(100vh-10rem)]">
            <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
            <li>
              {[...sellers, ...buyers]
                .filter((chatUser) =>
                  chatUser.seller_name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((chatUser) => {
                  return (
                    <a
                      key={chatUser.id}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_SELECTED_ROOM",
                          payload: {
                            selected_chatUserId: chatUser.id,
                            selected_chatUserName: chatUser.seller_name,
                            selected_chatUserAvatar: chatUser.seller_avatar,
                          },
                        })
                      }
                      className={`${
                        chatUser.id === state.selectedRoom?.selected_chatUserId
                          ? "bg-gray-100"
                          : ""
                      } flex items-center px-3 py-2 text-sm 
                    transition duration-150 ease-in-out border-b 
                    border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none`}
                    >
                      <Image
                        className="object-cover w-10 h-10 rounded-full"
                        src={chatUser.seller_avatar}
                        alt="username"
                        height="40"
                        width="40"
                        objectFit="cover"
                      />
                      <div className="w-full pb-2">
                        <div className="flex justify-between">
                          <span className="block ml-2 font-semibold text-gray-600">
                            {chatUser.seller_name}
                          </span>
                          <span className="block ml-2 text-sm text-gray-600">
                            25 minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          {/* item name and last message */}
                          <div>
                            <span className="block ml-2 font-bold text-gray-600">
                              {chatUser.item_name}
                            </span>
                            <span className="block ml-2 text-sm text-gray-600">
                              Last message sent by user
                            </span>
                          </div>
                          {/* item image */}
                          <Image
                            className="object-cover w-10 h-10 rounded-lg"
                            src={chatUser.item_avatar}
                            alt="item-url"
                            height="40"
                            width="40"
                          />
                        </div>
                      </div>
                    </a>
                  );
                })}
            </li>
          </ul>
        </div>

        {state.selectedRoom ? (
          <div className="hidden lg:col-span-2 lg:block">
            <div className="w-full">
              <div className="relative flex items-center p-3 border-b border-gray-300">
                <Image
                  className="object-cover w-10 h-10 rounded-full"
                  src={state.selectedRoom.selected_chatUserAvatar}
                  alt="selected_conversation"
                  height="40"
                  width="40"
                />
                <span className="block ml-2 font-bold text-gray-600">
                  {state.selectedRoom.selected_chatUserName}
                </span>
                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
              </div>

              <div
                ref={scrollRef}
                className="w-full p-6 overflow-y-scroll h-[calc(100vh-14rem)]"
              >
                <ul className="space-y-2">
                  {selectedRoomMsgs?.map((msg) => {
                    if (msg.profile_id === user.id) {
                      return (
                        <li key={msg.id} className="flex justify-end ">
                          <div className="bg-[#395dff] relative max-w-xl px-4 py-2 text-white rounded-tl-full rounded-tr-full rounded-bl-full shadow-xl">
                            <span className="block">{msg.content}</span>
                          </div>
                        </li>
                      );
                    } else {
                      return (
                        <li key={msg.id} className="flex justify-start">
                          <div className="relative max-w-xl px-4 py-2 text-black rounded-tl-full rounded-tr-full rounded-br-full shadow-xl">
                            <span className="block">{msg.content}</span>
                          </div>
                        </li>
                      );
                    }
                  })}
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
        ) : (
          <div className="hidden lg:col-span-2 lg:block">
            <h1 className="my-2 mb-2 ml-2 text-lg text-gray-600">
              Please select a chat
            </h1>
          </div>
        )}
      </div>
    </div>
  );
  console.log(
    "🚀 ~ file: ExperimentalChatUI.jsx ~ line 352 ~ {[...sellers,...buyers].map ~ chatUser",
    chatUser
  );
};

export default ExperimentalChatUI;
