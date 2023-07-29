export default function subscribeHandler(req, res) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { email } = data;
    res.status(200).json({ success: true, email });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
