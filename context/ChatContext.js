import { createContext, useContext, useEffect, useReducer } from "react";

const intialChatState = {
  selectedRoomId: null,
};

export const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SELECTED_ROOM":
      return {
        ...state,
        selectedRoomId: action.payload,
      };
  }
};

const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, intialChatState);

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
