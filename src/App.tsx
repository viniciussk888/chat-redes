/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
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
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [socketConnectionReady, setSocketConnectionReady] = useState(false);
  const chatEndRef = useRef(null);
  // receive token and id from url params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const destinatarioId = urlParams.get("destinatarioId");

  useEffect(() => {
    const interval = setInterval(() => {
      getMensagens();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

export default App;
