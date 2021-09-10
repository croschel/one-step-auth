import * as dotenv from "dotenv";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import createUserController from "./controllers/create_user";
import requestOneTimePassController from "./controllers/request_one_time_pass";
import * as serviceAccount from "../service_account.json";

dotenv.config();

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

export const request_one_time_pass = functions.https.onRequest(
  (request, response) => requestOneTimePassController(request, response)
);
