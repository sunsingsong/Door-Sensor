import React, { Component } from "react";
import styled from "styled-components";
import config from "./config";
import Microgear from "microgear";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  min-height: 0;
  font-family: "Roboto", sans-serif;
`;

const Image = styled.img`
  height: 250px;
  min-width: 0;
  min-height: 0;
`;

const Image2 = styled.img`
  margin-top: 0px;
  margin-left: 78%;
  width: 20%;
  height: auto;
`;

const Header = styled.div`
  margin-left: 0%;

  margin-bottom: 10px;
  font-size: 64px;
  width: 54%;
  // text-align : center;
  font-family: "Pacifico", cursive;
`;

const BoxPanel = styled.div`
  width: 100%;
  overflow: hidden;
  height: 350px;
  padding: 15px;
  text-align: center;
  img {
    display: inline-block;
  }
`;

const Panel = styled.div`
  background: rgb(255, 233, 180);
  overflow: hidden;
  height: 125px;
  width: 33%;
  text-align: center;
  div {
    display: inline-block;
    margin: 10px;
  }
  button {
    display: inline-block;
  }
`;
const Panel2 = styled.div`
  background: rgb(255, 233, 180);
  overflow: hidden;
  height: 125px;
  width: 33%;
  text-align: center;
  div {
    display: inline-block;
    margin: 10px;
  }
  button {
    display: inline-block;
  }
`;
const Panel3 = styled.div`
  background: #f7d7a4;
  overflow: hidden;
  height: 125px;
  width: 34%;
  text-align: center;
  div {
    display: inline-block;
    margin: 10px;
  }
  button {
    display: inline-block;
  }
`;

const Selector = styled.select`
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  font-size: 14px;
  padding: 8px;
  width: 250px;
  color: #4b4f5d;
`;

const Button = styled.button`
  border-radius: 7px !important;
  text-align: center;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  color: #757575;
  font-size: 20px;
  background: #ffffff;
  padding: 5px 10px 5px 10px;
  text-decoration: none;
  &:hover {
    background-color: #f6f6f7;
    cursor: pointer;
  }
`;

const APPID = "EmbeddedLabFinalProject";
const KEY = "Ks0tJdF0yzZaTMS";
const SECRET = "8kcOaB5T4R2c4tTzxcuwpNOgA";

const ALIAS = "my_server"; //  ชื่อตัวเอง
const thing1 = "esp8266"; //  ชื่ออุปกรณ์ปลายทางที่จะคุย

var microgear = Microgear.create({
  key: KEY,
  secret: SECRET,
  alias: ALIAS
});

// microgear.on("present", function(event) {
//   console.log(event);
// });

// microgear.on("absent", function(event) {
//   console.log(event);
// });

// microgear.resettoken(function(err) {
//   microgear.connect(APPID);
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      state: 1,
      status: "Not Connected"
      //1 == safe
      //2 == thief cao barn
      //3 == deactivate
    };
    this.setActivate = this.setActivate.bind(this);

    microgear.on("message", (topic, data) => {
      if (data == "ON") {
        this.setState({ state: 1 });
      } else if (data == "OFF") {
        this.setState({ state: 3 });
      } else if (data == "OPEN") {
        this.setState({ state: 2 });
      }
    });

    microgear.on("connected", () => {
      microgear.setAlias(ALIAS);
      this.setState({ status: "Connected to NETPIE" });
    });
    microgear.connect(APPID);
  }
  switchPress(logic) {
    if (logic == 1) {
      microgear.chat(thing1, "ON");
    } else if (logic == 0) {
      microgear.chat(thing1, "OFF");
    }
    if (logic == 2) {
      microgear.chat(thing1, "CLOSE");
    }
  }
  setActivate(stage) {
    if (stage == false) {
      this.setState({
        isOpen: stage,
        state: 3
      });
    } else {
      this.setState({
        isOpen: stage,
        state: 1
      });
    }
  }

  setReset() {
    this.setState({
      isOpen: 1,
      state: 1
    });
  }

  render() {
    console.log(this.state);
    return (
      <Container>
        {/* <Container className="greenBlackground"> */}
        <div style={{ width: "45%", marginBottom: "20px" }}>
          <Image2 src="img/logo.png" align="middle" />
        </div>
        <Header>Anti Thief</Header>
        <BoxPanel
          className={this.state.isOpen ? "greenBackground" : "redBackground"}
        >
          {/* <h1> Status </h1> */}

          {this.state.state == 1 && (
            <div>
              <h1> SECURE </h1>
              <Image
                src="img/secure2.png"
                align="middle"
                style={{ marginTop: "20px" }}
              />
            </div>
          )}
          {this.state.state == 2 && (
            <div>
              <h1> SOMEONE IS IN YOUR HOUSE </h1>
              <Image
                src="img/warning.gif"
                align="middle"
                style={{ marginTop: "20px" }}
              />
            </div>
          )}
          {this.state.state == 3 && (
            <div>
              <h1> DEACTIVATE </h1>
              <Image
                src="img/deactivate.png"
                align="middle"
                style={{ marginTop: "20px" }}
              />
            </div>
          )}
        </BoxPanel>
        <Panel>
          <h2>I'm leaving home</h2>
          <Button
            onClick={() => {
              this.setActivate(true);
              this.switchPress(1);
            }}
          >
            Activate
          </Button>
        </Panel>
        <Panel2>
          <h2>I'm coming home</h2>
          {/* <h1>{this.state.status}</h1> */}
          <Button
            onClick={() => {
              this.setActivate(false);
              this.switchPress(0);
            }}
          >
            Deactivate
          </Button>
        </Panel2>
        <Panel3>
          <h2>Reboot System</h2>
          <Button
            onClick={() => {
              this.setReset();
              this.switchPress(1);
              this.switchPress(2);
            }}
          >
            {" "}
            Reset
          </Button>
        </Panel3>
      </Container>
    );
  }
}

export default App;
