import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// PROTOTYP: liest die echten Daten aus ../../data, deshalb fs.allow bis zur Repo-Wurzel.
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: { fs: { allow: ["../.."] } },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
})

export default config
