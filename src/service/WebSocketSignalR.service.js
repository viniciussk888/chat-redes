import * as signalR from "@microsoft/signalr";

class WebSocketSignalRService {
  static async initSocketConnection(token, callback) {
    if (!this.connection) {
      this.connection = await new signalR.HubConnectionBuilder()
        .withUrl("https://rede-sebrae-api.azurewebsites.net/rede-chat", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .withHubProtocol(new signalR.JsonHubProtocol())
        .configureLogging(signalR.LogLevel.Information)
        .build();

      WebSocketSignalRService.startConnection(callback);
    }
  }

  static async closeSocketConnection(callback = undefined) {
    Object.defineProperty(WebSocket, "CLOSE", { value: 0 });
    this.connection
      .stop()
      .then(callback)
      .catch(() => console.log("Connection dont close"));
  }

  static startConnection(callback = undefined) {
    Object.defineProperty(WebSocket, "OPEN", { value: 1 });
    this.connection
      .start()
      .then(callback)
      .catch(() =>
        setTimeout(() => WebSocketSignalRService.startConnection(), 5000)
      );
  }

  static onReceiveMessage(name, callback) {
    this.connection.on(name, callback);
  }

  static unsubscribeMessage(name, callback) {
    this.connection.off(name, callback);
  }
}

export default WebSocketSignalRService;
