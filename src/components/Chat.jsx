import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const fetchChats = useCallback(async () => {
    if (!targetUserId) return;

    const res = await axios.get(BASE_URL + "/chatHistory/" + targetUserId, {
      withCredentials: true,
    });

    setMessages(res.data?.messages || []);
  }, [targetUserId]);

  useEffect(() => {
    // async to avoid sync state-set lint warnings
    (async () => {
      await fetchChats();
    })();
  }, [fetchChats]);

  useEffect(() => {
    if (!user?._id || !targetUserId) return;

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }

    const socket = socketRef.current;

    socket.emit("joinChat", { userId: user._id, targetUserId });

    const onMessageReceived = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("messageReceived", onMessageReceived);

    return () => {
      socket.disconnect();
    };
  }, [user?._id, targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const partnerLabel = useMemo(() => {
    return "Chat";
  }, []);

  const formatTime = (value) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || !user?._id || !targetUserId) return;

    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("sendMessage", {
      userId: user._id,
      targetUserId,
      newMessage: trimmed,
    });

    setText("");
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl px-3 py-4">
        <div className="flex items-center gap-3 rounded-box bg-base-200 px-4 py-3 shadow-sm">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                alt="user avatar"
                src={
                  user?.photoUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold">{partnerLabel}</div>
            <div className="text-sm opacity-70">
              Online • {user?.firstName || "You"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex h-[70vh] flex-col rounded-box bg-base-100 shadow-sm">
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarGutter: "stable" }}>
            <div className="chat">
              {messages.map((m, id) => (
                <div
                  key={id}
                  className={`chat ${m?.senderId === user?._id ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-bubble">
                    <div className="whitespace-pre-wrap">{m?.text}</div>
                    <div className="mt-1 text-[11px] opacity-60">
                      {formatTime(m?.createdAt || m?.time)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-base-300 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  className="textarea textarea-bordered w-full min-h-[46px] max-h-[140px] resize-none"
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={send}
                disabled={!text.trim()}
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-xs opacity-70">
              Tip: Press Enter to send, Shift+Enter for a new line.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

