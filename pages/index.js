import Head from "next/head";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";
import SubscribeNewsletter from "../components/SubscribeNewsletter";

export default function Home({ story }) {
  story = useStoryblokState(story, {
    resolveRelations: ["popular-articles.articles"],
  });

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1 className="text-3xl font-bold text-center my-3">Blog</h1>
      </header>

      <main className="w-full">
        <StoryblokComponent blok={story.content} />

        <SubscribeNewsletter />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let slug = "home";

  let sbParams = {
    version: "draft", // or 'published'
    resolve_relations: ["popular-articles.articles"],
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    },
    revalidate: 3600,
  };
}
