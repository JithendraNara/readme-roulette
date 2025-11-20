
export const LOADING_MESSAGES = [
  "Scanning 'untitled' repositories...",
  "Parsing broken commits...",
  "Decrypting developer tears...",
  "Accessing 3 AM commit history...",
  "Filtering out stack overflow copy-pastes...",
  "Locating FIXME tags...",
  "Connecting to legacy servers...",
  "Searching for 'TODO: clean this up'..."
];

export const FALLBACK_ARTIFACTS = [
  {
    repoName: "test-project-v2-final-real",
    fileName: "utils_deprecated.js",
    language: "JavaScript",
    codeSnippet: "// I don't know why this works but if I delete it the login page crashes\nconst magicNumber = 42;"
  },
  {
    repoName: "backend-monolith-legacy",
    fileName: "UserAuth.java",
    language: "Java",
    codeSnippet: "// God help whoever has to maintain this regex\nString emailRegex = \"^[_A-Za-z0-9-\\\\+]+(\\\\.[_A-Za-z0-9-]+)*...\""
  },
  {
    repoName: "frontend-rewrite-2024",
    fileName: "Button.tsx",
    language: "TypeScript",
    codeSnippet: "// TODO: Refactor this prop drilling hell before deployment (narrator: they didn't)"
  },
  {
    repoName: "legacy-php-forum",
    fileName: "index.php",
    language: "PHP",
    codeSnippet: "// This was written by a contractor who disappeared in 2012. Do not touch."
  },
  {
    repoName: "ai-model-training",
    fileName: "data_loader.py",
    language: "Python",
    codeSnippet: "# FIXME: This assumes the dataset fits in RAM. Spoiler: it doesn't."
  },
  {
    repoName: "ios-app-v1",
    fileName: "ViewController.swift",
    language: "Swift",
    codeSnippet: "// I hate AutoLayout. I hate AutoLayout. I hate AutoLayout."
  },
  {
    repoName: "db-migrations",
    fileName: "004_fix_everything.sql",
    language: "SQL",
    codeSnippet: "-- force drop cascade; I just want to go home."
  },
  {
    repoName: "game-engine-prototype",
    fileName: "physics.cpp",
    language: "C++",
    codeSnippet: "// Magic number 0.016 derived from a dream I had."
  },
  {
    repoName: "old-website-backup",
    fileName: "styles.css",
    language: "CSS",
    codeSnippet: "/* !important !important !important - please apply just work */"
  },
  {
    repoName: "payment-gateway-integration",
    fileName: "Process.cs",
    language: "C#",
    codeSnippet: "// temporary fix for the demo tomorrow. DO NOT MERGE."
  },
  {
    repoName: "intern-project-abandoned",
    fileName: "Main.java",
    language: "Java",
    codeSnippet: "// If you are reading this, I have already quit."
  },
  {
    repoName: "blockchain-nft-marketplace",
    fileName: "WalletConnect.js",
    language: "JavaScript",
    codeSnippet: "// Race condition here. If user clicks fast enough, they get double money. Shhh."
  },
  {
    repoName: "dating-app-mvp",
    fileName: "matching_algo.py",
    language: "Python",
    codeSnippet: "# The algorithm is just random.choice() for now, marketing said it's 'AI powered'"
  },
  {
    repoName: "corporate-dashboard",
    fileName: "Chart.vue",
    language: "Vue",
    codeSnippet: "// I'm sorry for the nested v-ifs. It was dark, I was cold."
  },
  {
    repoName: "rust-rewrite-attempt-1",
    fileName: "main.rs",
    language: "Rust",
    codeSnippet: "// borrow checker 1, me 0. abandoning project."
  }
];
