export const profile = {
  name: "Georgie Goo",
  preferredName: "Georgie",
  title: "Full-stack engineer | UI engineer",
  location: "Gold Coast, QLD",
  email: "georgie.goo@westpac.com.au",
  linkedin: "https://www.linkedin.com/in/ruoxuan-goo/",
  summary:
    "Highly driven full-stack engineer. I believe in continuous learning, teamwork and problem-solving. I am also passionate about leveraging emerging technologies and staying ahead of industry trends to contribute to innovative projects that drive digital transformation and create meaningful user experiences.",
};

export const skills = [
  {
    group: "Front-end / Back-end",
    items: [
      "React",
      "React Native",
      "TypeScript",
      "Next.js",
      "JavaScript",
      "Remix",
      "Vue 2",
      "Angular",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "RESTful APIs",
      "GraphQL",
      "Swagger",
      "SQL",
      "SASS/LESS",
    ],
  },
  {
    group: "Cloud Services",
    items: ["AWS EC2", "S3", "Amplify", "Lambda", "CloudFront"],
  },
  { group: "Databases", items: ["MySQL", "MongoDB"] },
  {
    group: "Tools",
    items: [
      "Git",
      "Bitbucket",
      "GitHub",
      "CI/CD",
      "Docker",
      "npm",
      "yarn",
      "Storybook",
      "Jira",
      "Postman",
    ],
  },
  {
    group: "Foundations",
    items: [
      "Software Development Lifecycle (SDLC)",
      "Object-Oriented Programming (OOP)",
      "Data Structures",
    ],
  },
];

// start/end are YYYY-MM (end null = current); they drive the career chart.
// Tags and highlights are drawn from each role's bullet points.
export const experience: {
  role: string;
  company: string;
  shortCompany: string;
  start: string;
  end: string | null;
  tags: string[];
  highlight?: { value: string; label: string };
  period: string;
  points: string[];
}[] = [
  {
    role: "Engineer",
    company: "Westpac Banking Corporation",
    shortCompany: "Westpac",
    start: "2025-11",
    end: null,
    tags: [
      "React",
      "TypeScript",
      "Micro-frontends",
      "Tailwind CSS",
      "Jest",
      "Swagger",
      "AI tooling",
    ],
    period: "Nov 2025 – Current",
    points: [
      "Top code contributor to two customer-facing React and TypeScript microfrontends, Book a Banker (business appointment booking) and Needs Selector Tool (product recommendation).",
      "Owned end-to-end feature delivery, including integration with the enterprise experience APIs and UI widget, as well as the development of custom UI solutions.",
      "Led the UI uplift from the legacy mep-ui component library to the GEL design system in MFEs, and upgraded both services to Tailwind CSS 4 for consistent, maintainable styling.",
      "Led the TypeScript migration across both micro-frontends.",
      "Strengthened engineering quality by introducing automated Husky pre-commit quality gates for linting, type checking, and testing.",
      "Identified, raised and resolved over 100 defects across projects up until now, contributing to improved application stability and reliability.",
      "Reduced technical debt by removing dead routes, unused exports and files, and redundant npm dependencies.",
      "Built an AI-assisted tool that generates, runs, and self-corrects Jest and React Testing Library tests for untested components on Amp, with quality guardrails.",
      "Supported intern and team members through hands-on mentoring, code reviews, pair programming.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Codafication",
    shortCompany: "Codafication",
    start: "2025-09",
    end: "2025-11",
    tags: ["Vite", "Webpack", "npm", "Dependency security"],
    period: "Sept 2025 – Nov 2025",
    points: [
      "Optimised frontend build infrastructure by migrating from Webpack to Vite, reducing build time by 50% and improving hot-reload performance for developers.",
      "Audited and resolved security vulnerabilities in NPM dependencies through dependency version upgrades, lockfile maintenance, and automated vulnerability scanning.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "Publicis Australia",
    shortCompany: "Publicis",
    start: "2024-08",
    end: "2025-08",
    tags: [
      "React",
      "TypeScript",
      "Next.js",
      "PayloadCMS",
      "React Hook Form",
      "Mapbox",
      "Google Maps",
      "WCAG 2",
      "AWS",
      "Docker",
    ],
    period: "Aug 2024 – Aug 2025",
    points: [
      "Led the transition from legacy tech stack to modern React, TypeScript, Next.js architecture, improving maintainability, performance, and developer productivity.",
      "Developed reusable and scalable components, interactive forms with Formik, React Hook Form and Zod, user authentication mechanisms, map integrations with Mapbox and Google Map API and other technology solutions.",
      "Maintained and modernised codebase for high-traffic government websites for prominent clients, including Cross River Rail and the Department of Transport and Main Roads.",
      "Ensured compliance with WCAG 2 website accessibility standards.",
      "Deployed applications to AWS services including EC2, S3 and Amplify, leveraging Docker for containerization.",
      "Upgraded project dependencies to align with the latest industry standards and reduce security vulnerabilities.",
    ],
  },
  {
    role: "Sessional Academic",
    company: "Queensland University of Technology (QUT)",
    shortCompany: "QUT",
    start: "2024-07",
    end: "2025-12",
    tags: ["Salesforce", "Apex", "SOQL"],
    period: "July 2024 – Dec 2025",
    points: [
      "Delivered face-to-face tutoring sessions for unit ‘Introduction to Enterprise Systems’.",
      "Covered foundational concepts of enterprise system architecture and guided students in software development using Salesforce, including Apex and Salesforce Object Query Language.",
    ],
  },
  {
    role: "Junior Developer",
    company: "Romeo Digital",
    shortCompany: "Romeo Digital",
    start: "2022-10",
    end: "2024-08",
    tags: [
      "React",
      "React Native",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "REST APIs",
      "Payload CMS",
      "AWS",
      "WCAG 2",
    ],
    period: "Oct 2022 – Aug 2024",
    points: [
      "Built mobile apps and web applications across multiple full-stack projects using TypeScript, JavaScript, React, React Native, Next.js and Tailwind CSS, integrating RESTful APIs and CMS.",
      "Utilized server-side rendering and other modern optimization techniques to ensure fast, responsive applications with improved load times and performance.",
      "Used AWS Lambda to automate scheduled tasks through cron jobs.",
      "Troubleshot and resolved production incidents and released patches promptly to minimize downtime.",
    ],
  },
  {
    role: "Blockchain Developer Intern",
    company: "Labrys",
    shortCompany: "Labrys",
    start: "2022-07",
    end: "2022-10",
    tags: ["Solidity", "Ethereum", "Web3", "MERN"],
    period: "Jul 2022 – Oct 2022",
    points: [
      "Created, tested and deployed Ethereum Smart Contracts with Solidity.",
      "Designed solutions for Web3.0 products.",
      "End-to-end development of functional web apps using MERN stack.",
    ],
  },
];

export const projects = [
  {
    name: "Containers for Change QLD App",
    year: "2023",
    description:
      "One of the main developers of the Containers for Change Mobile App, facilitating the recycling and cashing in of eligible containers at local refund points.",
    highlight: "120k+ installs · 4,000 monthly active users",
    link: "https://apps.apple.com/au/app/containers-for-change-qld/id1490518719",
    linkLabel: "View on App Store",
  },
  {
    name: "Q2032 Website",
    year: "2023",
    description:
      "One of the main developers of a centralized portal providing up-to-date information about the progress and opportunities of the Olympic Games for Queenslanders.",
    link: "https://q2032.au/",
    linkLabel: "Visit q2032.au",
  },
  {
    name: "EY Open Science Data Challenge",
    year: "2023",
    description:
      "Developed an AI model using high-resolution satellite data to assess storm damage and aid in disaster response and recovery, enhancing coastal community resilience against climate change effects.",
  },
];

export const education = [
  {
    title: "Master of Information Technology, Computer Science",
    school: "Queensland University of Technology (QUT)",
    period: "Aug 2021 – Aug 2023",
    detail: "GPA 6.78",
  },
  {
    title: "AI Engineer Bootcamp",
    period: "2025",
    detail: "Generative AI, LLMs Overview, RAG, Langchain.js, OpenAI",
  },
];

export const leadership = [
  {
    title: "QUT Entrepreneurship Student Advisory Board",
    period: "June 2020 – Feb 2022",
    description:
      "Student representative of QUT’s entrepreneurship ecosystem. Part of the QUT Budding Scholarship interview panel.",
  },
  {
    title:
      "Undergraduate Representative, Faculty Learning & Teaching Steering Committee",
    period: "Feb 2019 – Feb 2020",
    description:
      "Provided advice on a range of matters requested by the Faculty Academic Board, including curriculum and policy matters that affect the function, standards, teaching and learning of the faculty.",
  },
];

export const achievements = [
  "Best Paper Award, 3rd Annual Conference on Research in IT Practice: “Developing a Web Application Integrating Supervised Algorithms for Detecting Misogynistic Tweets”",
  "Science Faculty Dean’s List",
  "Member of College of Excellence",
];
