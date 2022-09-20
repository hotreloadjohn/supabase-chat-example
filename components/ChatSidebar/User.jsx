import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import { useChat } from "../../context/ChatContext";

const User = ({ room }) => {
  const { state, dispatch } = useChat();
  // dispatch({ type: "UPDATE_SID", payload: convo.sid });

  const cUser = {
    uid: "1234",
    isActive: false,
    sender: "5656",
    message: { text: "hello" },
    time: "10:38PM",
    avatar: "https://i.pravatar.cc/300",
    counter: 2,
    seen: true,
  };

  const chatUser = {
    uid: "123",
  };

  const user = {
    uid: "34543",
  };
  // !active user
  const handleClick = () => {
    console.log(`Selected room ${room.id}`);
    dispatch({ type: "UPDATE_SELECTED_ROOM", payload: room });
  };

  // !message seen
  //    useEffect(() => {
  //       if (show && !cUser.seen && connectionId && cUser.sender === cUser.uid) {
  //          set(ref(messagesDB, `connection/${connectionId}/options/seen`), true);
  //       }
  //    }, [cUser.seen]);

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer h-[74px] overflow-hidden whitespace-normal text-ellipsis rounded-1 text-[15px] text-[#7a7f9a] leading-[22.5px] py-4 px-5 mb-0.5 flex justify-between gap-3 transition-colors duration-300 hover:bg-[#e6ebf5] dark:hover:bg-[#36404a] tablet:hover:bg-inherit tablet:dark:hover:bg-inherit ${
        // window.innerWidth > 991 &&
        state.selectedRoomId?.id === room.id && "bg-[#e6ebf5] dark:bg-[#36404a]"
      } `}
    >
      <div
        className={`rounded-full w-[35px] h-[35px] bg-cover box-content overflow-hidden text-left mr-1 shadow-sm dark:shadow-lg ${
          cUser.isActive.status &&
          "border-2 border-green-600 dark:border-green-500"
        }`}
      >
        <img className="rounded-full" src={cUser.avatar} alt="profile-light" />
      </div>
      <div className="flex-1 w-10">
        <h5 className="font-semibold relative text-[15px] text-[#495057] dark:text-[#e1e9f1] transition-colors duration-300 tracking-wide leading-[18px] mb-1">
          {cUser.username}
          {cUser?.admin && (
            <span className="text-[9px] text-[#06d6a0] absolute -top-1 ml-[1px]">
              admin
            </span>
          )}
        </h5>

        {/* text */}
        <div className="flex items-start gap-1 text-sm dark:text-[#abb4d2] transition-colors duration-300">
          {cUser.sender === user.uid && (
            <span className="font-semibold">You:</span>
          )}
          <p
            className={`leading-5 h-6 overflow-hidden whitespace-normal text-ellipsis ${
              !cUser.seen && cUser.sender !== user.uid && "font-semibold"
            }`}
          >
            {room.name}
          </p>
        </div>
      </div>
      <div className="text-[11px] leading-4 h-full flex flex-col  justify-start items-center gap-0.5 w-10">
        <span className="dark:text-[#abb4d2] transition-colors duration-300">
          {cUser.time.substring(16, 21)}
        </span>
        {!cUser.seen && cUser.sender !== user.uid ? (
          <span className="w-[18px] h-[21px] bg-[#ef476f2e] text-[#ef476f] text-[10px] rounded-[800px] font-semibold leading-4 py-[2.5px] px-1.5 text-center">
            {cUser?.counter}
          </span>
        ) : (
          cUser.isActive.status && (
            <span className="text-sm text-green-500">
              {cUser.isActive.content}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default User;
