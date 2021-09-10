import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

type UserData = {
  code: number;
  codeValid: boolean;
};

const verifyOneTimePass = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  if (!req.body.phone || !req.body.code) {
    res.status(422).send({ error: "You must provide a phone number and Code" });
  }
  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  // const code = parseInt(req.body.code);

  // Find the phone on firebase and get the code
  const db = admin.firestore();
  const userRef = db.collection("users").doc(phone);

  try {
    const user = await userRef.get();
    const userData = user.data();
    const { code, codeValid } = userData as UserData;
    if (!codeValid) {
      res.status(400).send({ error: "Code is not valid" });
    } else {
      if (code !== req.body.code) {
        res.status(422).send({ error: "Code is not equal" });
      } else {
        try {
          await userRef.update({ codeValid: false });
          const token = await admin.auth().createCustomToken(phone);
          res.json({ token });
        } catch (err) {
          res.status(422).send({
            error: {
              title: "Your token could not be generated",
              description: err,
            },
          });
        }
      }
    }
  } catch (error) {
    res.status(422).send({ error });
  }
};

export default verifyOneTimePass;
