import slugify from "slugify";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { ROUTES } from "@consts";
import { loadEnv } from "./lib/env";

interface ButtonDownEmailsResponse {
  results: ButtonDownListingEmail[];
  count: number;
}

interface ButtonDownListingEmail {
  id: string;
  creation_date: string;
  publish_date: string;
  subject: string;
  body: string;
  email_type: "public" | "private";
  status: "sent" | "draft";
}

function sanitize(s: string) {
  return (
    s
      // strip html comments in the string.
      .replace(
        // - `<!--` matches the literal start of HTML comment.
        // - `[\s\S]` character class matches any whitespace or non-whitespace character (`.` would not include newline).
        // - `*?` match zero or more non-greedily
        // - `-->` matches the literal end of an HTML comment.
        // - `\s*` matches any trailing whitespace.
        /<!--[\s\S]*?-->\s*/g,
        "",
      )
      // replace buttondown URLs with local URLs
      .replace(
        /https:\/\/buttondown\.com\/passionately-curious\/archive\/([^/"]+)\/?/g,
        (_, slug) => `${ROUTES.Articles}/${slug}`,
      )
      // simplify anchor tags
      .replace(
        // - `<a\s+` matches opening anchor tag and required whitespace
        // - `[^>]*` matches any attributes before href
        // - `href="([^"]+)"` captures the href value
        // - `[^>]*` matches any attributes after href
        // - `>` matches closing bracket
        /<a\s+[^>]*href="([^"]+)"[^>]*>/g,
        '<a href="$1">',
      )
  );
}

async function importNewsletters() {
  if (!process.env.BUTTONDOWN_API_KEY) {
    throw new Error("BUTTONDOWWN_API_KEY not available in the environment");
  }
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  try {
    const response = await fetch("https://api.buttondown.com/v1/emails", {
      method: "GET",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as ButtonDownEmailsResponse;
    const publishedEmails = data["results"].filter(
      (email) => email.email_type === "public" && email.status === "sent",
    );
    for (const email of publishedEmails) {
      const titleParts = email.subject.split(/[:-]/).map((part) => part.trim());
      const title = titleParts[0];
      const subtitle = titleParts[1];
      if (!title) {
        throw new Error(`email ${email.id} has no title`);
      }
      const slug = slugify(title, { lower: true, strict: true });
      const date = new Date(email.publish_date).toISOString().split("T")[0];
      const frontmatter = `---
title: "${title}"
date: ${date}
description: ${subtitle}
draft: false
---`;

      const content = `${frontmatter}\n\n${sanitize(email.body)}`;

      const dirPath = join(process.cwd(), "src", "content", "articles", slug);
      await mkdir(dirPath, { recursive: true });

      const filePath = join(dirPath, "index.md");
      await writeFile(filePath, content, "utf-8");
      console.log(`Created: ${filePath}`);
    }

    console.log(`Imported ${publishedEmails.length} newsletters`);
  } catch (error) {
    console.error("Error importing newsletters:", error);
  }
}

async function main() {
  await loadEnv();
  await importNewsletters();
}

main();
