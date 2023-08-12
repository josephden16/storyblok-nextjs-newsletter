import {
  addToSubscribersList,
  getSubscriptionListMember,
  sendSubscriptionConfirmationMail,
  getConfirmationURL,
} from "../../helpers";
import crypto from "crypto";

export default async function signupHandler(req, res) {
  if (req.method !== "POST") {
    // Return an error response for unsupported HTTP methods
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const data = JSON.parse(req.body);
    const { email } = data;

    if (!email) {
      throw new Error("Enter a valid email address");
    }

    const subscriptionListMember = await getSubscriptionListMember(email);

    if (subscriptionListMember) {
      const { subscribed, vars } = subscriptionListMember;

      if (subscribed) {
        return res.status(200).json({
          success: true,
          message: "You've already subscribed to the newsletter",
        });
      } else {
        const { confirmationCode } = vars;
        const confirmationURL = getConfirmationURL(email, confirmationCode);
        await sendSubscriptionConfirmationMail(email, confirmationURL);

        return res.status(200).json({
          success: true,
          message: "Go to your mailbox to confirm your newsletter subscription",
        });
      }
    } else {
      const confirmationCode = crypto.randomBytes(32).toString("hex");
      await addToSubscribersList(email, confirmationCode);
      const confirmationURL = getConfirmationURL(email, confirmationCode);
      await sendSubscriptionConfirmationMail(email, confirmationURL);

      return res.status(200).json({
        success: true,
        message: "Go to your mailbox to confirm your newsletter subscription",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to send subscription confirmation email",
    });
  }
}
