import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Panashe Fundira",
  EMAIL: "fundirap@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Personal site for Panashe M. Fundira.",
};

export const ARTICLES: Metadata = {
  TITLE: "Articles",
  DESCRIPTION: "I post occasional musings",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my client projects and testimonials",
};

export const SOCIALS: Socials = [
  {
    NAME: "twitter-x",
    HREF: "https://twitter.com/PanasheTweets",
  },
  {
    NAME: "github",
    HREF: "https://github.com/munyari",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/panashe-fundira",
  },
];
