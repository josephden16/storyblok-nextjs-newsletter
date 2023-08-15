import { removeFromSubscribersList } from "../helpers";

export default function Unsubscribe({ unsubscribed, message }) {
  return (
    <div className="text-center mt-10">
      {unsubscribed ? (
        <div>
          <h1 className="font-bold text-xl my-2">
            You have been successfully unsubscribed.
          </h1>
          <p>
            We are sorry to see you go. You will no longer receive our
            newsletter.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-bold text-xl my-2">Unsubscription failed.</h1>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { unsubscribed, message } = await removeFromSubscribersList(
    query.email,
    query.confirmationCode
  );
  return {
    props: {
      unsubscribed,
      message,
    },
  };
}
