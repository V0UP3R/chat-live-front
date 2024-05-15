'use client'
import React, { Component, FormEvent, ChangeEvent } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { NextPage } from "next";

const useStyles = {
  submit: {
    margin: "16px 0",
  },
};

interface Message {
  msg: string;
  name: string;
}

interface AppState {
  filledForm: boolean;
  messages: Message[];
  value: string;
  name: string;
  room: string;
}

class App extends Component<any, AppState> {
  state: AppState = {
    filledForm: false,
    messages: [],
    value: "",
    name: "",
    room: "test",
  };

  client: W3CWebSocket;

  constructor(props: any) {
    super(props);
    this.client = new W3CWebSocket(
      "ws://127.0.0.1:8000/ws/" + this.state.room + "/"
    );
  }

  onButtonClicked = (e: FormEvent) => {
    this.client.send(
      JSON.stringify({
        type: "message",
        text: this.state.value,
        sender: this.state.name,
      })
    );
    this.setState({ value: "" });
    e.preventDefault();
  };

  componentDidMount() {
    this.client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    this.client.onmessage = (message: any) => {
      const dataFromServer = JSON.parse(message.data.toString());
      if (dataFromServer) {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.text,
              name: dataFromServer.sender,
            },
          ],
        }));
      }
    };
  }

  render() {
    return (
      <div style={{ margin: "0 auto", maxWidth: 400 }}>
        {this.state.filledForm ? (
          <div style={{ marginTop: 50 }}>
            <div>Room Name: {this.state.room}</div>
            <div style={{ height: 500, maxHeight: 500, overflow: "auto" }}>
              {this.state.messages.map((message, index) => (
                <div key={index}>
                  <div className="text-black">{message.name}</div>
                  <div>{message.msg}</div>
                </div>
              ))}
            </div>
            <form
              style={{ marginTop: 20 }}
              onSubmit={this.onButtonClicked}
            >
              <input
                type="text"
                placeholder="Write text"
                value={this.state.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ value: e.target.value });
                }}
              />
              <button
                type="submit"
                style={{ ...useStyles.submit, backgroundColor: "blue", color: "white", border: "none", padding: "10px 20px", cursor: "pointer" }}
              >
                Send Message
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div>
              <input
                type="text"
                placeholder="Room name"
                value={this.state.room}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ room: e.target.value });
                }}
              />
              <input
                type="text"
                placeholder="sender"
                value={this.state.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ name: e.target.value });
                }}
              />
              <button
                onClick={() => {
                  this.setState({ filledForm: true });
                }}
                style={{ ...useStyles.submit, backgroundColor: "blue", color: "white", border: "none", padding: "10px 20px", cursor: "pointer" }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const HomePage: NextPage = () => {
  return <App />;
};

export default HomePage;
