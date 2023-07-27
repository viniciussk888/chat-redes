/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FlatList from "flatlist-react";
import { MensagemComponent } from "./components/MensagemComponent";
// @ts-ignore
import WebSocketSignalRService from "./service/WebSocketSignalR.service";
import axios from "axios";

type Mensagem = {
  id: string;
  remetenteId: string;
  mensagem: string;
  enviadoEm: string;
  visualizada: boolean;
  imagem?: string;
  imagemUrls?: string[];
  minhaMensagem: boolean;
};

function App() {
  const [message, setMessage] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [socketConnectionReady, setSocketConnectionReady] = useState(false);
  const chatEndRef = useRef(null);
  // receive token and id from url params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const destinatarioId = urlParams.get("destinatarioId");

  const getMensagens = async () => {
    const response = await axios.get(
      `https://rede-sebrae-api.azurewebsites.net/chat/${destinatarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const mensagens = response.data.items;
    setMensagens(mensagens);
  };

  useEffect(() => {
    if (token && destinatarioId) {
      getMensagens();
    }
  }, [token, destinatarioId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      // @ts-ignore
      chatEndRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!message) {
      return;
    }
    if (!socketConnectionReady) {
      return;
    }

    try {
      WebSocketSignalRService.connection
        .invoke("enviarMensagemParaUsuario", destinatarioId, message, null)
        .then(() => {
          console.log("Mensagem enviada com sucesso!");
          setMessage("");
          getMensagens();
          scrollToBottom();
        });
    } catch (error) {
      console.log("Erro ao enviar a mensagem", error);
    }
  }, [socketConnectionReady, message]);

  useEffect(() => {
    if (token && !socketConnectionReady) {
      WebSocketSignalRService.initSocketConnection(token).then(() => {
        console.log("Connection ready!");
        setSocketConnectionReady(true);
      });
    }
    return () => {
      WebSocketSignalRService.closeSocketConnection().then(() => {
        console.log("Connection Closed!");
        setSocketConnectionReady(false);
      });
    };
  }, [token]);

  useEffect(() => {
    if (socketConnectionReady) {
      WebSocketSignalRService.onReceiveMessage(
        "receberMensagemDeUsuario",
        async function (mensagem: Mensagem) {
          console.log("Receber mensagem habilitado");
          console.log(mensagem);
          getMensagens();
        }
      );
    }
    return () => {
      WebSocketSignalRService.unsubscribeMessage("receberMensagemDeUsuario");
    };
  }, [socketConnectionReady]);
  return (
    <Wrapper>
      <FlatList
        list={mensagens}
        renderItem={(item: Mensagem) => (
          <MensagemComponent
            enviadoEm={item.enviadoEm}
            visualizada={item.visualizada}
            texto={item.mensagem}
            minhaMensagem={item.minhaMensagem}
          />
        )}
        renderWhenEmpty={() => <div>Chat vazio</div>}
      />
      <div ref={chatEndRef} />
      <SendMessageWrapper>
        <SendMessageInput
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Digite sua mensagem"
        />
        <SendMessageButton onClick={handleSendMessage}>
          Enviar
        </SendMessageButton>
      </SendMessageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fbfaff;
  padding-inline: 5px;
  width: 95vw;
  height: 100%;
`;

const SendMessageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 90vw;
  height: 50px;
`;

const SendMessageInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  color: #4a4a4a;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
`;

const SendMessageButton = styled.button`
  width: 100px;
  height: 100%;
  border: none;
  outline: none;
  background-color: #cd5be8;
  color: #fff;
  margin-left: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
`;

export default App;
