import ArticleTeaser from "./ArticleTeaser";
import { getStoryblokApi, storyblokEditable } from "@storyblok/react";

import { useState, useEffect } from "react";

const AllArticles = ({ blok }) => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const getArticles = async () => {
      const storyblokApi = getStoryblokApi();
      const { data } = await storyblokApi.get(`cdn/stories`, {
        version: "draft", // or 'published'
        starts_with: "blog/",
        is_startpage: false,
      });

      setArticles((prev) =>
        data.stories.map((article) => {
          article.content.slug = article.slug;
          return article;
        })
      );
    };
    getArticles();
  }, []);
  return (
    <>
      <p className="text-3xl">{blok.title}</p>
      <div
        className="grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-3   lg:px-24 md:px-16"
        {...storyblokEditable(blok)}
      >
        {articles[0] &&
          articles.map((article) => (
            <ArticleTeaser article={article.content} key={article.uuid} />
          ))}
      </div>
    </>
  );
};
export default AllArticles;
