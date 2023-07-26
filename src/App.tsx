import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FlatList from "flatlist-react";
import { MensagemComponent } from "./components/MensagemComponent";

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
