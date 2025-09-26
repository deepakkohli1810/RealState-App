import {Account, Avatars, Client, OAuthProvider ,  } from 'appwrite' ;
import * as Linking from 'expo-linking' ;
export const config ={
 platform : 'com.deepak.restate',
 projectId : process.env.EXPO_PUBLIC_PROJECT_ID ,
 endpoint : process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ,
}

export const client = new Client()  ;

client
.setEndpoint(config.endpoint!) // Your API Endpoint
.setProject(config.projectId!)
// .setPlatform(config.platform!) ; // Your project ID

export const avatar = new Avatars(client) ;
export const account = new Account(client) ;

export async function login(){
 try {
   const redirectUri  = Linking.createURL('/');
   const response = await account.createOAuth2Token(OAuthProvider.Google , redirectUri) ;
   if(!response) throw new Error('Login Failed') ;
   const browserResult  = await openAuthSessionAsync(response.toString() , redirectUri) ; 
   if(browserResult.type != 'success' ) throw new Error('Login Failed') 
   const uri = new URL(browserResult.url) ;
  const secret = uri.searchParams.get('secret')?.toString() ;
  const userId = uri.searchParams.get('userId')?.toString() ;

  if(!secret || !userId) throw new Error('Login Failed') ;

  const session  = await account.createSession(userId , secret); 
  if(!session) throw new Error('Login Failed') ;
  return true ;

    } catch (error) {
  console.log(error) ;
 
  return false ; 
 }
}

export async function logout(){
 try {
  await account.deleteSession("current") ;
  return true ;
  
 } catch (error) {
  console.log(error) ;
  return false ;
 }
}


export async function getUser(){
 try {
  const response = await account.get() ;
  if(response.$id){
   const userAvatar = avatar.getInitials({name : response.name || 'User' , width : 100 , height : 100}) ;
   return {
    ...response ,
    avatar : userAvatar.toString(), 
   }
  }
 } catch (error) {
  
 }
}