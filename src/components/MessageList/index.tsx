import React, { useState, useEffect } from "react";

import { ScrollView } from "react-native";
import { api } from "../../services/api";
import io from "socket.io-client";

import { Message, MessageProps } from "../Message/index";
import { styles } from "./styles";

let messagesQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));
socket.on("new_message", (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessage, setCurrentMessage] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>("/messages/last3");
      setCurrentMessage(messagesResponse.data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessage((prevState) => [
          messagesQueue[0],
          prevState[0],
          prevState[2],
        ]);
        messagesQueue.shift();
      }
    }, 3000);


    return () => clearInterval(timer)
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessage.map((message) => {
        <Message key={message.id} data={message} />;
      })}
    </ScrollView>
  );
}
