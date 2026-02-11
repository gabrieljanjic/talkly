import type { Message } from "../types/types";

const RenderAllMessagesComponent = ({
  messages,
  myUserId,
}: {
  messages: Message[];
  myUserId: string | null;
}) => {
  if (!myUserId) return null;

  return (
    <div className="flex flex-col ">
      <div className="flex-1 flex flex-col px-6 py-2 w-full overflow-y-auto gap-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`py-1 px-2 sm:py-2 rounded-xl w-fit max-w-3/4 shadow-md ${
                myUserId === message.senderId
                  ? "bg-emerald-500 text-white self-end rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm sm:text-base">{message.text}</p>
            </div>
          ))
        ) : (
          <p className="text-center mt-12 text-gray-700">No messages</p>
        )}
      </div>
    </div>
  );
};

export default RenderAllMessagesComponent;
