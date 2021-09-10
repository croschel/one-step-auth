import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const createUser = (req: functions.https.Request, res: functions.Response) => {
  // Verify the user provider a phone
  if (!req.body.phone) {
    res.status(422).send({ error: "Bad input" });
  }
  // Format the phone number to remove dashes and parenthesis
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Create a new user account using that phone number
  admin
    .auth()
    .createUser({
      uid: phone,
    })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      return res.status(422).send({ error: err });
    }); // Responde to user request, saying the account was made
};

export default createUser;
