import { Account, Avatars, Client, OAuthProvider } from 'appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser'; 

export const config = {
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
 
};

export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL('/');
    const oauthUrl = account.createOAuth2Token(OAuthProvider.Google, redirectUri);
    
    const browserResult = await openAuthSessionAsync(oauthUrl.toString(), redirectUri);
    
    if (browserResult.type !== 'success') {
      throw new Error('OAuth flow was not completed successfully');
    }

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    if (!secret || !userId) {
      throw new Error('Missing credentials in OAuth callback');
    }

    await account.createSession(userId, secret);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();
    const userAvatar = avatar.getInitials({
      name: response.name || 'User',
      width: 100,
      height: 100,
    });
    return {
      ...response,
      avatar: userAvatar.toString(),
    };
  } catch (error) {
    return null; // ✅ Explicit return
  }
}