import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { METADATA } from "@consts";

type Context = {
  site: string;
};

export async function GET(context: Context) {
  const articles = (await getCollection("articles")).filter(
    (post) => !post.data.draft,
  );

  const projects = (await getCollection("projects")).filter(
    (project) => !project.data.draft,
  );

  const items = [...articles, ...projects].sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  return rss({
    title: METADATA.Home.Title,
    description: METADATA.Home.Description,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
