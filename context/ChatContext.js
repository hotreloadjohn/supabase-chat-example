import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

const intialChatState = {
  selectedRoomId: null,
  chatMessages: [],
  rooms: [],
  newMessage: null,
  conversations: {},
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

    case "UPDATE_MESSAGES":
      return {
        ...state,
        chatMessages: action.payload,
      };

    case "INIT_ROOMS":
      return {
        ...state,
        rooms: action.payload,
      };

    case "INIT_CONVO":
      return {
        ...state,
        conversations: action.payload,
      };

    case "UPDATE_CONVO":
      const updatedConvs = { ...state.conversations };
      const convoRoom = updatedConvs[action.payload.room_id];
      //Dunno what is react-devtool doing
      const isAdded = convoRoom.find((msg) => msg.id === action.payload.id);
      if (!isAdded) updatedConvs[action.payload.room_id].push(action.payload);

      return {
        ...state,
        conversations: updatedConvs,
      };
  }
};

const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, intialChatState);

  const mountedRef = useRef(true);
  const { user, error } = useUser();

  const addNewMessageToConversation = async (newMessage) => {
    console.log("addNewMessageToConversation called");
    const { data } = await supabaseClient
      .from("messages")
      .select("*, profile: profiles(id, username)")
      .match({ id: newMessage.id })
      .order("created_at")
      .single();

    if (data) {
      console.log(data);
      dispatch({ type: "UPDATE_CONVO", payload: data });
    }
  };
  // Get all rooms from supabase
  useEffect(() => {
    let roomSubscriptions = [];
    const newRoomAddListener = null;

    const getRooms = async () => {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select("*, room_participants!inner(*)")
        .eq("room_participants.profile_id", user?.id)
        .order("created_at", { ascending: false });

      // if (error) alert(error);
      if (data) {
        dispatch({ type: "INIT_ROOMS", payload: data });
        // dispatch({ type: "UPDATE_SELECTED_ROOM", payload: data[0].id });
        console.log(`Init Rooms: ${data}`);

        const convos = await Promise.all(
          data.map(async (room) => {
            const { data } = await supabaseClient
              .from("messages")
              .select("*, profile: profiles(id, username)")
              .match({ room_id: room.id })
              .order("created_at");
            return { [room.id]: data };
          })
        );

        dispatch({
          type: "INIT_CONVO",
          payload: Object.assign({}, ...convos),
        });

        // subscribe to all message-room listener
        data.forEach((room) => {
          console.log(`subscribing to ${room.name}`);
          let subscription = supabaseClient
            .from(`messages:room_id=eq.${room.id}`)
            .on("INSERT", (payload) => {
              // TODO: add new user to cache if their profile doesn't exist
              // setThisMessages((current) => [...current, payload.new]);
              console.log(payload.new);
              addNewMessageToConversation(payload.new);
              // getUserProfile(payload.new);
            })
            .subscribe();
          console.log(
            "🚀 ~ file: ChatContext.js ~ line 68 ~ data.forEach ~ subscription",
            subscription
          );

          roomSubscriptions.push(subscription);
        });

        newRoomAddListener = supabaseClient
          .from("rooms")
          .on("INSERT", (payload) => console.log(payload.new))
          .subscribe();
        console.log(
          "🚀 ~ file: ChatContext.js ~ line 145 ~ getRooms ~ newRoomAddListener",
          newRoomAddListener
        );
      }
    };

    if (mountedRef.current && user) {
      console.log("Calling getRooms()");
      getRooms();
      mountedRef.current = false;
    }

    return () => {
      if (roomSubscriptions.length > 0) {
        console.log("unsubscribing...");
        roomSubscriptions.forEach((sub) =>
          supabaseClient.removeSubscription(sub)
        );
      }

      if (newRoomAddListener)
        supabaseClient.removeSubscription(newRoomAddListener);

      mountedRef.current = true;
    };
  }, [user]);

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
