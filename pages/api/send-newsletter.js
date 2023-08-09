import StoryblokClient from "storyblok-js-client";
import { getHostURL, sendNewsletterMail } from "../../helpers";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
});

export default async function sendNewsletter(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { full_slug } = req.body;

    // Ignore stories that aren't blog posts
    if (!full_slug.startsWith("blog/")) {
      return res
        .status(400)
        .json({ message: "Only blog posts are applicable for newsletters" });
    }

    const response = await Storyblok.get(`cdn/stories/${full_slug}`);
    const { content } = response.data.story;
    const { title, teaser, image, shouldSendNewsletter } = content;
    const link = getHostURL() + "/" + full_slug;

    if (!shouldSendNewsletter) {
      return res.status(400).json({ message: "Not applicable for newsletter" });
    }

    const newsletterData = {
      subject: `New Article - ${title}`,
      post: {
        title: title,
        teaser: teaser,
        link: link,
        image: image.filename,
      },
    };

    await sendNewsletterMail(newsletterData);

    console.log("Newsletter Sent!");
    res.status(201).json({ message: "Newsletter Sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
