import React, { useState } from "react";

import { View, TextInput, Alert, Keyboard } from "react-native";
import { api } from "../../services/api";
import { COLORS } from "../../theme";
import { Button } from "../Button";

import { styles } from "./styles";

export function SendMessageForm() {
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit() {
    const messageFormatted = message.trim();
    await api.post('/messages', {message: messageFormatted});

    setMessage('');
    Keyboard.dismiss();
    setSendingMessage(true);
    Alert.alert('Mensagem Enviada com Sucesso !')

    if (messageFormatted.length > 0) {
      setSendingMessage(false);


    } else {
      Alert.alert("Escreva a mensagem para Enviar");
    }
    
  }

  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        placeholder="Qual sua Expectativa para o Evento ?"
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        style={styles.input}
        editable={!sendingMessage}
      />

      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}
