// Projetos da seção "Projetos", na ordem em que aparecem.
// Para adicionar um projeto, copie um bloco { ... } e edite; para remover, apague o bloco.
//
// status:  "production" | "beta" | "development" | "done"
// preview: { image: "assets/projects/nome.jpg" }  screenshot em 16:10 (ex.: 1440x900)
//          { icon: "assets/projects/nome-icon.png" }  ícone do app, para quem ainda não tem site
// url:     site ou loja (opcional)
// repos:   repositórios públicos; deixe [] quando o código for privado.
//          "name" é opcional e aparece como "Repositório · name".
// Textos com { "pt-br": ..., en: ... } seguem o idioma do site.
window.PROJECTS = [
  {
    name: "OptPaste",
    status: "production",
    type: { "pt-br": "App macOS + site", en: "macOS app + site" },
    description: {
      "pt-br":
        "App de barra de menus para macOS que guarda o histórico da área de transferência e abre com um atalho global (⌥V), com itens fixados, navegação por teclado e atualização automática via Sparkle. O site, em React + Vite, traz uma demo interativa do painel.",
      en: "Menu bar app for macOS that keeps your clipboard history and opens with a global shortcut (⌥V), with pinned items, keyboard navigation and automatic updates via Sparkle. The site, built with React + Vite, includes an interactive demo of the panel.",
    },
    stack: ["Swift", "SwiftUI", "AppKit", "Sparkle", "React", "Vite", "TypeScript"],
    preview: { image: "assets/projects/optpaste.jpg" },
    url: "https://optpaste.pages.dev",
    repos: [
      { name: "app", url: "https://github.com/alirioguerra/OptPaste" },
      { name: "site", url: "https://github.com/alirioguerra/optpaste-site" },
    ],
  },
  {
    name: "Tap Royale",
    status: "beta",
    type: { "pt-br": "Jogo mobile + API + site", en: "Mobile game + API + site" },
    description: {
      "pt-br":
        "Jogo arcade casual para Android: toque nas estrelas, fuja das bombas e suba no ranking de cada modo. App em React Native com Skia e Reanimated, backend próprio em Fastify + Postgres, compras via RevenueCat, anúncios premiados verificados no servidor e site em Nuxt.",
      en: "Casual arcade game for Android: tap the stars, dodge the bombs and climb each mode's leaderboard. React Native app with Skia and Reanimated, a custom Fastify + Postgres backend, purchases through RevenueCat, server-verified rewarded ads and a Nuxt site.",
    },
    stack: ["React Native", "Expo", "TypeScript", "Skia", "Reanimated", "Fastify", "Drizzle", "Postgres", "RevenueCat", "Nuxt"],
    preview: { image: "assets/projects/taproyale.jpg" },
    url: "https://tap-royale.pages.dev",
    repos: [],
  },
  {
    name: "Lexis",
    status: "development",
    type: { "pt-br": "App mobile", en: "Mobile app" },
    description: {
      "pt-br":
        "Diário de leitura para iOS e Android: registre livros e progresso, receba recomendações e leia junto em clubes, com leituras compartilhadas, metas e cronograma. Backend em Supabase com Edge Functions e assinaturas via RevenueCat.",
      en: "Reading journal for iOS and Android: log books and progress, get recommendations and read together in clubs, with shared readings, goals and schedules. Supabase backend with Edge Functions and subscriptions through RevenueCat.",
    },
    stack: ["React Native", "Expo Router", "TypeScript", "Supabase", "React Query", "RevenueCat"],
    preview: { icon: "assets/projects/lexis-icon.png" },
    repos: [],
  },
];
