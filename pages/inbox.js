import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import ChatContainer from "../components/ChatContainer";
import ChatSidebar from "../components/ChatSidebar";
import ExperimentalChatUI from "../components/ExperimentalChatUI";
import Layout from "../components/Layout";

// https://github.com/habibmustafa/realtime-chatapp
const Inbox = () => {
  const { user } = useUser();
  return (
    <Layout>
      {/* <div className=" flex flex-grow min-w-[280px] mt-20">
        <div className="flex h-full w-full tablet:flex-col-reverse tablet:w-full">
          <ChatSidebar />
          <ChatContainer />
        </div>
      </div> */}
      {user && <ExperimentalChatUI user={user} />}
    </Layout>
  );
};

export default Inbox;

export const getServerSideProps = withPageAuth({ redirectTo: "/" });
