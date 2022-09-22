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
  selectedRoom: null,
  chatMessages: [],
  rooms: [],
  newMessage: null,
  conversations: {},
  currUser: null,
};

export const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRUSER":
      return {
        ...state,
        currUser: action.payload,
      };
    case "UPDATE_SELECTED_ROOM":
      return {
        ...state,
        selectedRoom: action.payload,
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

    case "UPDATE_ROOMS":
      return {
        ...state,
        rooms: [action.payload, ...state.rooms],
      };

    case "INIT_CONVO":
      return {
        ...state,
        conversations: action.payload,
      };

    // case "ADD_CONVO":
    //   return {
    //     ...state,
    //     conversations: { ...state.conversations, [action.payload.room_id]: [] },
    //   };

    case "UPDATE_CONVO":
      console.log("i am called (UPDATE_CONVO)");
      const updatedConvs = { ...state.conversations };
      // Try find loaded conversations
      const convoRoom = updatedConvs[action.payload.room_id];
      // new room = convoRoom undefined
      if (convoRoom) {
        //Dunno what is react-devtool doing
        const isAdded = convoRoom.find((msg) => msg.id === action.payload.id);
        if (!isAdded) updatedConvs[action.payload.room_id].push(action.payload);
      } else {
        updatedConvs[action.payload.room_id] = [action.payload];
      }

      return {
        ...state,
        conversations: updatedConvs,
      };
  }
};

const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, intialChatState);
  const { user } = useUser();

  const mountedRef = useRef(true);

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

  const checkRoomParticipants = async (room) => {
    const { data, error } = await supabaseClient.rpc("is_room_participant", {
      room_id: room.id,
      profile_id: user.id,
    });

    if (error) alert(error.message);

    return data;
  };

  useEffect(() => {
    const initRoomsMessages = async (rooms) => {
      // init messages in rooms
      const convos = await Promise.all(
        rooms.map(async (room) => {
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

      // Mount Message Listener
      // supabaseClient.removeAllSubscriptions(); //TODO: call when user signout
      rooms.forEach((room) => {
        supabaseClient
          .from(`messages:room_id=eq.${room.id}`)
          .on("INSERT", (payload) => {
            // console.log(payload.new);
            addNewMessageToConversation(payload.new);
            // getUserProfile(payload.new);
          })
          .subscribe();
      });
    };

    const initOnNewRoomCreated = async () => {
      supabaseClient
        .from("rooms")
        .on("INSERT", async (payload) => {
          // check if room created intended for user
          const doUpdateRooms = await checkRoomParticipants(payload.new);

          if (doUpdateRooms) {
            const { data, error } = await supabaseClient
              .from("rooms")
              .select("*, products!inner(*)")
              .eq("id", payload.new.id)
              .single();

            dispatch({ type: "UPDATE_ROOMS", payload: data });
            // Sub room-message listener
            supabaseClient
              .from(`messages:room_id=eq.${payload.new.id}`)
              .on("INSERT", (msgPayload) => {
                console.log(msgPayload.new);
                addNewMessageToConversation(msgPayload.new);
                // getUserProfile(payload.new);
              })
              .subscribe();
          }
        })
        .subscribe();
    };

    const initUserRooms = async () => {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select("*, room_participants!inner(*), products!inner(*)")
        .eq("room_participants.profile_id", user.id)
        .order("created_at", { ascending: false });

      if (error) alert(error.message);
      dispatch({ type: "INIT_ROOMS", payload: data });

      initRoomsMessages(data);
      // init new room listener
      initOnNewRoomCreated();
    };

    if (mountedRef.current && user?.id) {
      // init rooms and messages in rooms
      initUserRooms();

      mountedRef.current = false;
    }
    return () => {
      mountedRef.current = true;
      supabaseClient.removeAllSubscriptions();
    };
  }, [user?.id]);

  // // Get all rooms from supabase
  // useEffect(() => {
  //   let roomSubscriptions = [];
  //   const newRoomAddListener = null;

  //   const getRooms = async () => {
  //     const { data, error } = await supabaseClient
  //       .from("rooms")
  //       .select("*, room_participants!inner(*)")
  //       .eq("room_participants.profile_id", state.currUser.id)
  //       .order("created_at", { ascending: false });

  //     // if (error) alert(error);
  //     if (data) {
  //       dispatch({ type: "INIT_ROOMS", payload: data });
  //       // dispatch({ type: "UPDATE_SELECTED_ROOM", payload: data[0].id });
  //       console.log(`Init Rooms: ${data}`);

  //       const convos = await Promise.all(
  //         data.map(async (room) => {
  //           const { data } = await supabaseClient
  //             .from("messages")
  //             .select("*, profile: profiles(id, username)")
  //             .match({ room_id: room.id })
  //             .order("created_at");
  //           return { [room.id]: data };
  //         })
  //       );

  //       dispatch({
  //         type: "INIT_CONVO",
  //         payload: Object.assign({}, ...convos),
  //       });

  //       // subscribe to all message-room listener
  //       data.forEach((room) => {
  //         console.log(`subscribing to ${room.name}`);
  //         let subscription = supabaseClient
  //           .from(`messages:room_id=eq.${room.id}`)
  //           .on("INSERT", (payload) => {
  //             // TODO: add new user to cache if their profile doesn't exist
  //             // setThisMessages((current) => [...current, payload.new]);
  //             console.log(payload.new);
  //             addNewMessageToConversation(payload.new);
  //             // getUserProfile(payload.new);
  //           })
  //           .subscribe();
  //         console.log(
  //           "🚀 ~ file: ChatContext.js ~ line 68 ~ data.forEach ~ subscription",
  //           subscription.state
  //         );

  //         roomSubscriptions.push(subscription);
  //       });

  //       newRoomAddListener = supabaseClient
  //         .from("rooms")
  //         .on("INSERT", (payload) => addNewRoom(payload.new))
  //         .subscribe();
  //       console.log(
  //         "🚀 ~ file: ChatContext.js ~ line 153 ~ getRooms ~ newRoomAddListener",
  //         newRoomAddListener.state
  //       );
  //     }
  //   };

  //   if (state.currUser !== null && mountedRef.current) {
  //     console.log("Calling getRooms()");
  //     getRooms();
  //     mountedRef.current = false;
  //   }

  //   return () => {
  //     if (roomSubscriptions.length > 0) {
  //       console.log("unsubscribing...");
  //       roomSubscriptions.forEach((sub) =>
  //         supabaseClient.removeSubscription(sub)
  //       );
  //     }

  //     if (newRoomAddListener)
  //       supabaseClient.removeSubscription(newRoomAddListener);

  //     mountedRef.current = true;
  //   };
  // }, [state.currUser]);

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
