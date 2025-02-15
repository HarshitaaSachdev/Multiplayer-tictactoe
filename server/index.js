import express from 'express';
import cors from 'cors';
import {StreamChat} from "stream-chat";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";

const app = express()

app.use(cors())
app.use(express.json()) 
const api_key = "5yxfz56p97gr"
const api_secret = "9x7wund6d6zk6rd644cns2s4ujsfjsnv46vmx7k8kquxfqpe3t8tmkz9n6y9hhyn"

const serverClient =  StreamChat.getInstance(api_key,api_secret);

app.post('/signup',async (req, res) => {
    try{
    const {firstName,lastName,username,password} = req.body;
    const userId = uuidv4(); //generate a random id for the user
    const hashedPassword = await bcrypt.hash(password,10); //hash password
    const token = serverClient.createToken(userId);//Create a token with the userID
    res.json({token,userId,firstName,lastName,username,hashedPassword}); 
    }catch(error){
       res.json(error)
    }
})

app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const { users } = await serverClient.queryUsers({ name: username });
      if (users.length === 0) return res.json({ message: "User not found" });
  
      const token = serverClient.createToken(users[0].id);
      const passwordMatch = await bcrypt.compare(
        password,
        users[0].hashedPassword
      );
  
      if (passwordMatch) {
        res.json({
          token,
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          username,
          userId: users[0].id,
        });
      }
    } catch (error) {
      res.json(error);
    }
  });
app.listen(3001, () => {
    console.log("server listening on port 3001")
})