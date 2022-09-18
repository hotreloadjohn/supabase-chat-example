import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { MessageSettings } from "./AnimatedDropdown";
import { useUser } from "@supabase/auth-helpers-react";

const Message = (props) => {
  const scrollRef = useRef();
  const [touchShow, setTouchshow] = useState(false);
  const { message, i, thisMessages } = props;
  const { user, error } = useUser();

  // const user = {
  //   uid: "John",
  //   username: "John",
  // };
  // const chatUser = {
  //   uid: "Terry",
  //   username: "Terry",
  // };

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [thisMessages, user]);

  // !touch event
  let touchTimer = null;
  const touchStart = () => {
    touchTimer = setTimeout(() => {
      setTouchshow(true);
      console.log("timeOut");
    }, 550);
    console.log("start");
  };
  const touchEnd = () => {
    clearTimeout(touchTimer);
    touchTimer = null;
    console.log("end");
  };

  return (
    <div ref={scrollRef} onTouchStart={touchStart} onTouchEnd={touchEnd}>
      {/* time seperate */}
      {/* <TimeSeperate {...props} /> */}

      {/* message */}
      <div
        className={`flex items-end justify-end relative gap-2.5 mt-6 tablet:gap-0 tablet:mt-3.5 ${
          message.profile.id !== user.id && "flex-row-reverse"
        } ${
          touchShow &&
          "before:absolute before:openBeforeAnimation before:w-[108%] before:h-[108%] before:-top-[4%] before:-left-[4%] before:bg-blue-300 before:bg-opacity-60"
        } `}
      >
        <div
          className={`flex flex-col gap-4 tablet:max-w-[82%] absview:max-w-[70%] ${
            message.profile.id !== user.id ? "items-start" : "items-end"
          }`}
        >
          <div
            className={`flex relative ${
              message.profile.id !== user.id && "flex-row-reverse"
            }`}
          >
            {/* more icon */}
            <div className="w-4 h-[15px] text-[#6159cb] relative text-[15px] leading-6 text-right inline-block">
              <MessageSettings
                message={message}
                setTouch={setTouchshow}
                align={message.profile.id !== user.id ? "left-0" : "right-0"}
              />
            </div>

            {/* text content */}
            <div
              tabIndex="14"
              className={`relative rounded-xl min-w-[90px] max-w-lg flex flex-col transition-colors duration-300 select-none ${
                message.profile.id !== user.id
                  ? "bg-[#f5f7fb] text-[#212529] dark:bg-[#36404a] dark:text-[#eff2f7] rounded-bl-none active:bg-[#d9dee2] dark:active:bg-[#212529]"
                  : "bg-[#7269ef] text-white rounded-br-none active:bg-[#383199]"
              } ${touchShow && "opacity-70"}`}
            >
              {/* reply message */}
              {message.reply && (
                <div
                  className={`flex flex-col break-words px-5 py-1.5 text-[13px] transition-colors duration-[350ms] rounded-tl-xl rounded-tr-xl m-1 ${
                    message.sender === chatUser.uid
                      ? "bg-[#e6e7e9] text-[#212529] dark:bg-[#2f373f] dark:text-[#eff2f7]"
                      : "bg-[#574de2] text-white"
                  }`}
                >
                  <p
                    className={`text-green-500 font-semibold ${
                      message.reply.user === chatUser.uid && "!text-orange-500"
                    }`}
                  >
                    {message.reply.user === chatUser.uid
                      ? chatUser.username
                      : "You"}
                  </p>
                  <p>{message.reply.message}</p>
                </div>
              )}

              {/* message text */}
              <div className={`px-5 py-1.5 w-full flex flex-col`}>
                <p className={`text-[15px] leading-6 font-medium break-all`}>
                  {message.content}
                </p>
                <span
                  className={`w-full text-left text-[#ffffff80] dark:text-[#B9B4F7] text-xs inline-block leading-[18px] ${
                    message.profile.id !== user.id &&
                    "!text-[#7a7f9a] dark:text-[#abb4d2] text-right"
                  }`}
                >
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* touch dropdown show-hidden */}
            {touchShow && (
              <MessageSettings
                touch={touchShow}
                setTouch={setTouchshow}
                scrollRef={scrollRef}
                message={message}
                align={
                  message.sender === chatUser.uid
                    ? "top-full left-3"
                    : "top-full right-3"
                }
              />
            )}
          </div>

          {/* last message user about */}
          {(thisMessages.length - 1 !== i &&
            thisMessages[i + 1].sender === message.sender) || (
            <p className="text-[#495057] dark:text-[#a6b0cf] transition-colors duration-[350ms] select-none text-sm leading-5 font-medium tablet:mx-2 tablet:text-xs">
              {/* {message.sender === user.uid ? user.username : chatUser.username} */}
              {message.profile.id !== user.id
                ? user.user_metadata.username
                : message.profile.username}
            </p>
          )}
        </div>

        {/* profile */}
        <div className="flex items-end rounded-full w-[35px] h-[35px] bg-cover text-right tablet:w-7 tablet:h-7">
          {(thisMessages.length - 1 !== i &&
            thisMessages[i + 1].profile_id === message.profile_id) || (
            <img
              className="rounded-full "
              //   src={message.sender === user.uid ? user.avatar : chatUser.avatar}
              src="https://i.pravatar.cc/300"
              alt="avatar"
            />
          )}
        </div>
        {/* {messages.find((item) => item.connectionId === connectionId).options.writing && <p>yaziyor..</p>} */}
      </div>
    </div>
  );
};

export default Message;
