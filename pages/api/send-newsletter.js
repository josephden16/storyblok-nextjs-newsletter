import StoryblokClient from "storyblok-js-client";
import { getHostURL, sendNewsletterMail } from "../../helpers";

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN,
});

export default async function sendNewsletter(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { full_slug, space_id, story_id } = req.body;

    const response = await Storyblok.get(
      `spaces/${space_id}/stories/${story_id}`
    );
    const { content } = response.data.story;
    const {
      title,
      teaser,
      image,
      sendNewsletter,
      newsletterSentAt,
      component,
    } = content;

    if (component !== "article") {
      return res
        .status(400)
        .json({ message: "Only blog posts are applicable for newsletters" });
    }

    if (!sendNewsletter || newsletterSentAt) {
      console.log("Not applicable for newsletter");
      return res.status(400).json({ message: "Not applicable for newsletter" });
    }

    const newsletterData = {
      subject: `New Article - ${title}`,
      post: {
        title: title,
        teaser: teaser,
        link: getHostURL() + "/" + full_slug,
        image: image.filename,
      },
    };

    const existingStory = response.data.story;
    existingStory.content.newsletterSentAt = new Date();
    await Storyblok.put(`spaces/${space_id}/stories/${story_id}`, {
      story: existingStory,
    });
    await sendNewsletterMail(newsletterData);
    console.log("Newsletter Sent!");
    res.status(201).json({ message: "Newsletter Sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
