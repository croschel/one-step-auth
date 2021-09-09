import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import createUserController from "./controllers/create_user";
import * as serviceAccount from "../service_account.json";

const { project_id, client_email, private_key } = serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: project_id,
    clientEmail: client_email,
    privateKey: private_key,
  }),
});

export const createUser = functions.https.onRequest((request, response) =>
  createUserController(request, response)
);
