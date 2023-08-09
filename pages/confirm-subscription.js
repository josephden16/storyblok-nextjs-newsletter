import { confirmSubscription } from "../helpers";

export default function ConfirmSubscription({ emailConfirmed, message }) {
  return (
    <div className="text-center mt-10">
      {emailConfirmed ? (
        <div>
          <h1 className="font-bold text-xl my-2">
            Thank you for confirming your email!
          </h1>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h1 className="font-bold text-xl my-2">Email confirmation failed</h1>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { emailConfirmed, message } = await confirmSubscription(
    query.email,
    query.confirmationCode
  );
  return {
    props: {
      emailConfirmed,
      message,
    },
  };
}
