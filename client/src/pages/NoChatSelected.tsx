import messageIllustration from "../images/message_illustration.svg";

const NoChatSelected = () => {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-neutral-50 to-gray-100">
      <div className="max-w-md text-center px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Talkly
        </h2>
        <div className="my-8">
          <img
            src={messageIllustration}
            alt="Chat illustration"
            className="w-40 mx-auto drop-shadow-lg"
          />
        </div>
        <p className=" text-gray-600 mb-6">
          Select a chat from the sidebar to start messaging
        </p>
      </div>
    </section>
  );
};

export default NoChatSelected;
