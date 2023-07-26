import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FlatList from "flatlist-react";
import { MensagemComponent } from "./components/MensagemComponent";
import hubConnection, {
  startSignalRConnection,
} from "./service/signalRservice";

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
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "1",
      remetenteId: "1",
      mensagem: "Olá, tudo bem?",
      enviadoEm: "2021-08-01T18:00:00",
      visualizada: true,
      minhaMensagem: true,
    },
    {
      id: "2",
      remetenteId: "2",
      mensagem: "Tudo ótimo, e você?",
      enviadoEm: "2021-08-01T18:01:00",
      visualizada: true,
      minhaMensagem: false,
    },
    {
      id: "2",
      remetenteId: "2",
      mensagem: "Tudo ótimo?",
      enviadoEm: "2021-08-01T18:01:00",
      visualizada: false,
      minhaMensagem: true,
    },
  ]);
  const chatEndRef = useRef(null);

  // receive token and id from url params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const destinatarioId = urlParams.get("destinatarioId");

  console.log("token", token);
  console.log("destinatarioId", destinatarioId);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMensagens((mensagens) => [
        ...mensagens,
        {
          id: "2",
          remetenteId: "2",
          mensagem: "Tudo ótimo?",
          enviadoEm: "2021-08-01T18:01:00",
          visualizada: false,
          minhaMensagem: Math.random() > 0.5,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    startSignalRConnection();

    // Defina os handlers para receber as mensagens do hub
    hubConnection.on("onReceiveMessage", (user, message) => {
      console.log("New message received:", user, message);
      // Faça o que quiser com a mensagem recebida (por exemplo, atualizar o estado do componente, exibir a mensagem na tela, etc.)
      setMensagens((mensagens) => [...mensagens, message]);
    });

    // Caso deseje realizar alguma ação ao se desconectar do SignalR
    hubConnection.onclose((err) => {
      console.log("SignalR connection closed:", err);
    });

    // Importante: Não se esqueça de remover os handlers quando o componente é desmontado
    return () => {
      hubConnection.off("ReceiveMessage");
      hubConnection.stop();
    };
  }, []);
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
  height: 100vh;
`;

export default App;
