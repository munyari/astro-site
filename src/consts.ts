import type { Site, Socials } from "@types";

export const SITE: Site = {
  NAME: "Panashe Fundira",
  EMAIL: "fundirap@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const ROUTES = {
  About: "/about",
  Articles: "/articles",
  Home: "/",
  Projects: "/projects",
  Consulting: "/consulting",
  Work: "/work",
} as const;

type RouteKeys = keyof typeof ROUTES;

type RouteMetadata = {
  [P in RouteKeys]: {
    Title: P; // enforce that key = title
    Description: string;
  };
};

export const METADATA: RouteMetadata = {
  Home: { Title: "Home", Description: "Personal site for Panashe M. Fundira." },
  About: {
    Title: "About",
    Description: "Information on me, my background and what I do",
  },
  Articles: { Title: "Articles", Description: "I post occasional articles" },
  Consulting: {
    Title: "Consulting",
    Description:
      "Information about working with me: who I help, my process, and how to contact me",
  },
  Projects: {
    Title: "Projects",
    Description: "A collection of my client projects and testimonials",
  },
  Work: {
    Title: "Work",
    Description: "Where I have worked and what I have done.",
  },
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
