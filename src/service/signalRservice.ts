// signalRService.js

import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://rede-sebrae-api.azurewebsites.net/rede-chat", {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => "teste",
  })
  .withAutomaticReconnect()
  .withHubProtocol(new signalR.JsonHubProtocol())
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const startSignalRConnection = async () => {
  try {
    await hubConnection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.log("Error while starting SignalR connection:", err);
  }
};

export default hubConnection;
