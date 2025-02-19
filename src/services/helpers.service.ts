import { Model } from 'mongoose';
import * as process from 'node:process';
import {UsersService} from "../users/users.service";
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const admin = require('firebase-admin');



export async function generateUniqueString(
  model: Model<any>,
  column: string,
  prefixe: string,
): Promise<string> {
  let code;
  let isUnique = false;
  while (!isUnique) {
    code = `${prefixe}-${Math.floor(100000 + Math.random() * 900000).toString()}`;
    const existingUser = await model.find({ column: code }).exec();
    if (existingUser.length == 0) {
      isUnique = true;
    }
  }
  return code;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Rayon moyen de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en kilomètres
}

export function estimateDuration(distance) {
  const averageSpeed = 10; // km/s
  const hours = distance / averageSpeed;
  const minutes = Math.round(hours * 60);
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

export async function sendNotification(title, body, token, data) {
  if (!admin.apps.length) {
    const serviceAccount = require('../../config/wt-zpickup-firebase-adminsdk-5dm4w-2c0344d8d8.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase initialisé');
  } else {
    console.log('Firebase est déjà initialisé');
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
    data: data,
  };

  console.log('message', message);

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification envoyée avec succès :', response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
  }
}


export async function sendNotificationForSeveralTokens(title, body, tokens, data) {
  if (!admin.apps.length) {
    const serviceAccount = require('../../config/wt-zpickup-firebase-adminsdk-5dm4w-2c0344d8d8.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase initialisé');
  } else {
    console.log('Firebase est déjà initialisé');
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
    data: data,
  };

  console.log('message', message);

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Notification envoyée avec succès :', response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
  }
}

// ************************ Implementation de l'api LeTexto ******************************

const prodUrl = "https://apis.letexto.com"
const token = "1b7ffb13e4a8b135f51a3a25984e9472"
const sender = "ZPICKUP"

export async function sendSMSLetexto(content: string, phoneNumber: string) {
  const url = encodeURI(
    `${prodUrl}/v1/messages/send?from=${sender}&to=${phoneNumber}&content=${content}&token=${token}`
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {},
    });

    const data = await response.json();
    console.log('SMS envoyé avec succès:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Erreur d'envoi SMS:", error);
    throw error;
  }
}

// ************************ Fin de l'Implementation de l'api LeTexto ******************************


/* export async function sendMessage(body, to) {
  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(message);
  } catch (error) {
    console.error(error);
  }
} */

export async function callZem(phoneNumber) {
  const client = twilio(accountSid, authToken);
  const call = await client.calls.create({
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    url: "http://demo.twilio.com/docs/voice.xml",
  });
  console.log(call);
}



