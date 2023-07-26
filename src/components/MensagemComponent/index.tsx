/* eslint-disable  */
import moment from "moment";
import styled from "styled-components";

export const Container = styled.div`
  padding: 8px;
  margin: 5px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export const SEText = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

type Props = {
  minhaMensagem?: boolean;
  texto: string;
  enviadoEm: string;
  visualizada: boolean;
};

export const MensagemComponent = ({
  minhaMensagem = false,
  texto,
  enviadoEm,
  visualizada,
}: Props) => {
  return (
    <Container
      style={
        minhaMensagem
          ? {
              backgroundColor: "#FFD486",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              borderTopRightRadius: 0,
              marginLeft: "50px",
            }
          : {
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderTopLeftRadius: 0,
              marginRight: 50,
            }
      }
    >
      <SEText
        style={{
          textAlign: "center",
          fontSize: 16,
          marginBottom: 5,
        }}
      >
        {texto}
      </SEText>
      <SEText
        style={{
          textAlign: "center",
          fontSize: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {moment(enviadoEm).format("DD/MM/YYYY HH:mm")}
        {"   "}
        {minhaMensagem && visualizada && (
          <SEText
            style={{
              color: "#2E7DCF",
              fontSize: 12,
              marginLeft: 5,
            }}
          >
            ✓✓
          </SEText>
        )}
        {minhaMensagem && !visualizada && " ✓✓"}
      </SEText>
    </Container>
  );
};
