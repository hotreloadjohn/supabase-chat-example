import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// !message settings
export const MessageSettings = ({
  message,
  align,
  touch = false,
  setTouch,
}) => {
  const [open, setOpen] = useState(touch ? true : false);
  const animRef = useRef();
  const buttonRef = useRef();

  const connectionId = "sdsds";
  const user = "";

  // !delete message
  const handleDelete = () => {
    setOpen(false);
    setTouch(false);
    if (message.sender === user.uid) {
      remove(
        ref(messagesDB, `connection/${connectionId}/messages/${message.uuid}`)
      );
      toast.success("Message Deleted!", {
        className:
          "bg-white text-[#212529] dark:bg-[#313a43] dark:text-[#f7f7ff]",
      });
    }
  };

  // !reply message
  const handleReply = () => {
    setOpen(false);
    setTouch(false);
    dispatch(
      setReply({
        user: message.sender === user.uid ? user.uid : message.sender,
        message: message.message.text,
      })
    );
  };

  // !outside click close
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        open &&
        animRef.current &&
        !animRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setTouch(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [open, touch, setTouch]);

  return (
    <>
      {/* trigger button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setOpen(!open);
        }}
        className="w-4 tablet:hidden"
      >
        <i className="ri-more-2-fill"></i>
      </button>

      {/* dropdown menu */}
      {open && (
        <ul
          ref={animRef}
          className={`w-[150px] select-none absolute z-10 bg-white dark:bg-[#313a43] text-[15px] rounded py-2 mt-1 mx-1.5 box-shadow text-[#212529] dark:text-[#939BB1] clear-both font-medium ${align}
             ${open ? "openAnimation" : " closeAnimation"}
         `}
        >
          <li
            onClick={() => {
              navigator.clipboard.writeText(message.message.text);
              setOpen(false);
              setTouch(false);
              toast.success("Successfully Copied!", {
                className:
                  "bg-white text-[#212529] dark:bg-[#313a43] dark:text-[#f7f7ff]",
              });
            }}
            className="flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]"
          >
            Copy <i className="ri-file-copy-line text-[#7a7f9a]"></i>
          </li>
          <li className="flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]">
            Save <i className="ri-save-line text-[#7a7f9a]"></i>
          </li>
          <li
            onClick={handleReply}
            className="flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]"
          >
            Reply <i className="ri-reply-line text-[#7a7f9a]"></i>
          </li>
          <li
            onClick={handleDelete}
            className={`flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2] ${
              message.sender !== user.uid && "opacity-50"
            }`}
          >
            Delete <i className="ri-delete-bin-line text-[#7a7f9a]"></i>
          </li>
        </ul>
      )}
    </>
  );
};

// !<-------------------------------User---------------------------------------->

// !user settings
export const UserSettings = () => {
  const [open, setOpen] = useState(false);
  // const { connectionId } = useSelector((state) => state.message);
  const buttonRef = useRef();
  const animRef = useRef();
  const dispatch = useDispatch();

  // !user message delete - deaktiv
  const handleDelete = () => {
    setOpen(false);
    toast.error("Disabled for Now!", {
      className:
        "bg-white text-[#212529] dark:bg-[#313a43] dark:text-[#f7f7ff]",
    });
    // remove(ref(messagesDB, `connection/${connectionId}/messages`));
  };

  // !outside click close
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        open &&
        animRef.current &&
        !animRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [open]);

  return (
    <>
      {/* trigger button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setOpen(!open);
        }}
        className="w-10 h-10 leading-10 hover:scale-110"
      >
        <i className="ri-more-fill"></i>
      </button>

      {/* dropdown menu */}
      {open && (
        <ul
          ref={animRef}
          className={`w-[150px] select-none absolute z-10 top-full right-0 bg-white dark:bg-[#313a43] text-[15px] rounded py-2 mt-1 mx-1.5 box-shadow text-[#212529] dark:text-[#939BB1] clear-both font-medium ${
            open ? "openAnimation" : " closeAnimation"
          }`}
        >
          <li
            onClick={() => {
              dispatch(setViewProfile(true));
              setOpen(false);
            }}
            className="hidden tablet:flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]"
          >
            View profile <i className="ri-user-2-line text-[#7a7f9a]"></i>
          </li>
          <li className="flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]">
            Muted <i className="ri-volume-mute-line text-[#7a7f9a]"></i>
          </li>
          <li
            onClick={handleDelete}
            className="flex justify-between items-center px-6 py-1.5 cursor-pointer hover:bg-[#f7f7ff] dark:hover:bg-[#36404a] dark:hover:text-[#DFE1E2]"
          >
            Delete <i className="ri-delete-bin-line text-[#7a7f9a]"></i>
          </li>
        </ul>
      )}
    </>
  );
};
