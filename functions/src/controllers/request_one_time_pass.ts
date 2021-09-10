import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import twilio from "../services/twillio";

const requestOneTimePass = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  if (!req.body.phone) {
    res.status(422).send({ error: "You must provide a phone number" });
  }
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Find the user model on firebase
  const user = await admin.auth().getUser(phone);

  if (!user) {
    res.status(400).send({ error: "User not found" });
  }

  const code = Math.floor(Math.random() * 8999 + 1000);
  try {
    await twilio.messages.create({
      body: `Your code is ${code}`,
      to: `+${phone}`,
      from: "+13126673093",
    });
  } catch (error) {
    res.status(422).send({ error });
  }

  const db = admin.firestore();
  const docRef = db.collection("users").doc(phone);
  try {
    await docRef.set({ code: code, codeValid: true });
    res.status(200).send({ success: true });
  } catch (error) {
    res
      .status(422)
      .send({ error: { title: "Insert database error", firebase: error } });
  }
};

export default requestOneTimePass;
