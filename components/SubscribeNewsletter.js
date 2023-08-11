import React, { useState } from "react";

function SubscribeNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (evt) => {
    evt.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email }),
      "Content-Type": "application/json",
    });
    const payload = await res.json();

    if (payload.success) {
      alert(payload.message);
    } else {
      alert("Failed to subscribe to newsletter");
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col items-center gap-2 w-full max-w-[500px] py-2"
      >
        <h2 className="text-2xl font-bold">Subsribe to our Newsletter!</h2>
        <p className="text-gray-500">
          Subscribe to our newsletter and stay updated.
        </p>
        <input
          type="email"
          placeholder="Your email"
          required
          onChange={(evt) => setEmail(evt.target.value)}
          className="border w-3/4 p-2 focus-within:outline-blue-200"
        />
        <button
          role="submit"
          className="bg-blue-400 p-2 w-3/4 text-white focus:outline-blue-200 outline-offset-2"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default SubscribeNewsletter;
