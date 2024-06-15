import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { StreamChat } from "stream-chat";
import{Chat} from "stream-chat-react"
import Cookies from "universal-cookie";
import {useState}  from 'react';
import JoinGame from "./components/JoinGame";

function App() {
  const api_key = "5yxfz56p97gr";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  }
  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }
  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <div className="logoutbutton">
          <button onClick={logOut}> Log Out</button>
          </div>
        </Chat>
      ) : (
        <>
          <Signup setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
