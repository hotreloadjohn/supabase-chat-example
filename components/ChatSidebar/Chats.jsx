import { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import User from "./User";
import { useChat } from "../../context/ChatContext";

const Chats = () => {
  const [search, setSearch] = useState("");
  const { state, dispatch } = useChat();

  const [sellers, setSellers] = useState([]);
  // !recent messages list
  const allUsers = true;

  useEffect(() => {
    const createSellerList = async () => {
      const sellerTemp = await Promise.all(
        state.rooms.map(async (room) => {
          const { data } = await supabaseClient
            .from("profiles")
            .select("*")
            .match({ id: room.buyer_id })
            .single();
          return {
            id: room.id,
            seller_name: data.username,
            item_name: room.name,
          };
        })
      );
      setSellers(sellerTemp);
    };

    if (state.rooms) {
      createSellerList();
    }
  }, [state.rooms]);

  return (
    <div className="h-full">
      <div className="py-6 px-7">
        <h4 className="h4-size mb-6 dark:text-[#e1e9f1] transition-colors duration-300">
          Chats
        </h4>

        {/* search */}
        <div className="w-[333px] h-11 bg-[#e6ebf5] dark:bg-[#36404a] transition-colors duration-300 flex items-center rounded-[6.4px] mb-2 tablet:w-full">
          <span className="flex items-center justify-center ml-2 w-9 h-full">
            <i className="ri-search-line search-icon text-lg leading-7 text-[#7a7f9a] dark:text-[#9aa1b9]"></i>
          </span>
          <input
            type="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
            placeholder="Search messages or users.."
            className="w-full h-full bg-inherit text-[#495057] dark:text-[#a6b0cf] py-2 font-medium px-3 text-sm leading-5 rounded-[6.4px] outline-none"
          />
        </div>
      </div>

      {/* recent */}
      <div className="recent pl-3 h-[calc(100%-202px)]">
        <h5 className="text-[#495057] dark:text-[#e1e9f1] transition-colors duration-300 font-semibold leading-5 mb-4">
          Recent
        </h5>
        <div className="users pr-2 mr-1 h-full  overflow-auto scrollbar-border scrollbar-current scrollbar-thumb-transparent hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-500 tablet:scrollbar-thumb-slate-300 tablet:dark:scrollbar-thumb-slate-500">
          {allUsers ? (
            !sellers ? (
              <div className="flex justify-center items-center relative -top-8 h-full font-semibold">
                <i className="ri-chat-new-line text-[#e6ebf5] dark:text-[#36404a] text-8xl duration-[350ms]"></i>
                {/* <p className="text-[#495057] dark:text-[#e1e9f1]">Start a Chat..</p> */}
              </div>
            ) : (
              sellers.map((room) => <User key={room.id} room={room} />)
              //   recentUsers
              //     .filter(
              //       (name) =>
              //         !name.username
              //           .toLowerCase()
              //           .indexOf(search.toLowerCase()) || search === ""
              //     )
              //     .map((cUser) => <User key={cUser.uid} cUser={cUser} />)
            )
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
