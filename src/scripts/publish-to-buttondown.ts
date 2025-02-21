import { readFile, readdir, writeFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const buttondownEmailResponse = z.object({
  absolute_url: z.string().url(),
  id: z.string(),
  subject: z.string(),
  status: z.enum(["draft", "scheduled", "sent"]),
});

interface Article {
  data: { [key: string]: any };
  body: string;
  slug: string;
}

async function getArticles() {
  const articlesDir = join(process.cwd(), "src/content/articles");
  const stack: string[] = [articlesDir];
  const articles: Array<Article> = [];

  while (stack.length > 0) {
    const currentDir = stack.pop()!;
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (
        entry.isFile() &&
        (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      ) {
        const content = await readFile(fullPath, "utf-8");
        const { data, content: body } = matter(content);
        const ancestorComponents = currentDir.split(/\//);
        const slug = ancestorComponents[ancestorComponents.length - 1];
        if (!slug) {
          throw new Error(`entry ${entry} has no parent`);
        }
        articles.push({
          data,
          body,
          slug,
        });
      }
    }
  }

  return articles;
}

async function updateFrontmatter(filePath: string): Promise<void> {
  const content = await readFile(filePath, "utf-8");
  const { data, content: body } = matter(content);

  const newData = {
    ...data,
    publishedToNewsletter: true,
  };

  const newContent = matter.stringify(body, newData);
  return await writeFile(filePath, newContent);
}

async function createGitCommit(filePath: string, title: string): Promise<void> {
  try {
    await execAsync(`git add "${filePath}"`);
    const { stdout: commitOutput, stderr: commitErr } = await execAsync(
      `git commit -m "Mark '${title}' as published to newsletter"`,
      {
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "Newsletter Bot",
          GIT_COMMITTER_NAME: "Newsletter Bot",
          GIT_AUTHOR_EMAIL: "newsletter-bot@example.com",
          GIT_COMMITTER_EMAIL: "newsletter-bot@example.com",
        },
      },
    );
    console.log(commitOutput);
    console.log(commitErr);
  } catch (error) {
    throw new Error(`Failed to create git commit: ${error}`);
  }
}

interface ButtondownPost {
  subject: string;
  body: string;
  email_type: "public" | "private";
}

async function publishToButtondown(post: Article) {
  if (!process.env.BUTTONDOWN_API_KEY) {
    throw new Error("BUTTONDOWN_API_KEY not found in environment");
  }

  const response = await fetch("https://api.buttondown.email/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: post.data.title,
      body: post.body,
      email_type: "private",
      status: "draft",
      filters: {
        filters: [
          {
            field: "email_address",
            operator: "equals",
            value: "fundirap@gmail.com",
          },
        ],
        groups: [],
        predicate: "and",
      },
    } as ButtondownPost),
  });

  if (!response.ok) {
    throw new Error(`failed to publish to Buttondown: ${response.statusText}`);
  }

  return buttondownEmailResponse.parse(await response.json());
}

async function publishNewPosts() {
  const articles = await getArticles();
  const unpublishedArticles = articles.filter(
    (article) =>
      !article.data.draft &&
      article.data.publishToNewsletter &&
      !article.data.publishedToNewsletter,
  );
  for (const article of unpublishedArticles) {
    const filePath = join(
      process.cwd(),
      "src/content/articles",
      article.slug,
      "index.md",
    );
    await updateFrontmatter(filePath);
    await createGitCommit(filePath, article.data.title);
    console.log(`Publishing "${article.data.title}" to Buttondown...`);
    const resp = await publishToButtondown(article);
    console.log(
      `Success! ${article.data.title} is live at ${resp.absolute_url}`,
    );
  }
}

publishNewPosts();
