import ChatContainer from "../components/ChatContainer";
import ChatSidebar from "../components/ChatSidebar";
import ExperimentalChatUI from "../components/ExperimentalChatUI";
import Layout from "../components/Layout";

// https://github.com/habibmustafa/realtime-chatapp
const Inbox = () => {
  return (
    <Layout>
      {/* <div className=" flex flex-grow min-w-[280px] mt-20">
        <div className="flex h-full w-full tablet:flex-col-reverse tablet:w-full">
          <ChatSidebar />
          <ChatContainer />
        </div>
      </div> */}

      <ExperimentalChatUI />
    </Layout>
  );
};

export default Inbox;
