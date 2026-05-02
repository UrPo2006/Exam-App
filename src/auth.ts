import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { FailLoginResponse, SuccessLoginResponse } from "./interfaces/login";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize:async(Credentials)=> {
        const res = await fetch('https://exam-app.elevate-bootcamp.cloud/api/auth/login',{
            method:"POST",
            body:JSON.stringify({
               username:Credentials?.username,
               password:Credentials?.password,
            }),
            headers:{'content-type':'application/json'}
        })
 const data: SuccessLoginResponse = await res.json();


  if (res.ok && data.payload) {
    return {
      id: data.payload.user.id,     
      name: data.payload.user.username,
      email: data.payload.user.email,
      token: data.payload.token,    
      user: data.payload.user ,
      role:data.payload.user.role,  
         
    };
  } else {

    throw new Error("Invalid username or password");
  }
}
   })
    
  
],
callbacks:{
  jwt:({token,user})=>{
   if(user){
     token.user = user.user;
    token.token = user.token;
    token.role= user.role; 
   
   } return token;//{user,token}
  },
  session:({session,token})=>{
   session.user = token.user;
 session.role = token.role;
 session.token = token.token;
    return session 

  }
},
pages:{
 signIn:'/login',
 error:'/login'
},
 secret:process.env.NEXTAUTH_SECRET


}