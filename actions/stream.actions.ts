'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User is not authenticated');
  if (!apiKey) throw new Error('Stream API key is missing');
  if (!apiSecret) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(apiKey, apiSecret);

  // Token is valid for 1 hour (3600 seconds)
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  
  // Issued 1 minute ago to handle server clock skew issues
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);

  return token;
};