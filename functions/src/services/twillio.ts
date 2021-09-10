import { Twilio } from "twilio";
import { twilioConfigs } from "../../constants";

const accountSid = twilioConfigs.TWILIO_ACCOUNT_SID;
const authToken = twilioConfigs.TWILIO_AUTH_TOKEN;

const twilio = new Twilio(accountSid, authToken);

export default twilio;
