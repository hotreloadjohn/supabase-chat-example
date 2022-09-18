import { useRef, useState } from "react";

const Header = () => {
  const [backBtn, setBackBtn] = useState(false); //window.innerWidth <= 991 ? true : false
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const buttonRef = useRef();
  const animRef = useRef();
  const chatUser = {
    isActive: {
      status: false,
      content: "Sep 17 2022 15:35",
    },
    username: "John",
  };
  return (
    <div className="header p-6 border-b border-[#f0eff5] dark:border-[#36404a] transition-colors duration-[350ms] text-[#495057] dark:text-[#e1e9f1] text-[15px] leading-[22.5px] flex justify-between tablet:py-4 tablet:px-1.5">
      {/* name */}
      <div className="flex items-center gap-3.5 w-full">
        {/* back button */}
        {backBtn && (
          <div
            className="flex items-center cursor-pointer h-full"
            // onClick={() => {
            //   dispatch(setShow(false));
            // }}
          >
            <p className="ri-arrow-left-s-line text-[28px]">back</p>
          </div>
        )}
        <div className="rounded-full w-[35px] h-[35px] bg-cover text-left flex-shrink-0">
          <img
            className="rounded-full "
            src="https://i.pravatar.cc/300"
            alt=""
          />
        </div>

        {/* username and status */}
        <div className="flex flex-col w-full">
          <p className="cursor-pointer relative font-semibold leading-5 tracking-wide">
            {chatUser?.username}
            {chatUser?.admin && (
              <span className="text-[9px] text-[#06d6a0] absolute -top-1 ml-[1px]">
                admin
              </span>
            )}
          </p>
          <span
            className={`text-sm w-full text-green-500 ${
              !chatUser?.isActive.status &&
              "!text-[#7a7f9a] dark:text-[#abb4d2]"
            }`}
          >
            {chatUser.isActive.status
              ? chatUser.isActive.content
              : chatUser.isActive.content.substring(0, 11) ===
                new Date().toString().substring(4, 15)
              ? `Today, ${chatUser.isActive.content.substring(12, 17)}`
              : chatUser.isActive.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
