import {
  Moon,
  Sun,
  Languages,
  Palette,
  Check,
  Settings2,
  Monitor,
  Globe2,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useLanguages } from "@/hooks/useLanguages";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { data: languages = [] } = useLanguages();

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card shadow-sm">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Settings
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your preferences and personalize your workspace.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN SETTINGS AREA
        ====================================================== */}
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* =================================================
              SIDEBAR
          ================================================== */}
          <aside>
            <div className="lg:sticky lg:top-6">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Settings
              </p>

              <nav className="space-y-1">
                <a
                  href="#appearance"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium"
                >
                  <Palette className="h-4 w-4" />
                  Appearance
                </a>

                <a
                  href="#language"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <Languages className="h-4 w-4" />
                  Language
                </a>
              </nav>

              <div className="mt-8 border-t pt-5">
                <p className="px-3 text-xs leading-5 text-muted-foreground">
                  Your preferences are saved automatically and applied
                  immediately.
                </p>
              </div>
            </div>
          </aside>

          {/* =================================================
              CONTENT
          ================================================== */}
          <div className="min-w-0 space-y-10">
            {/* =================================================
                APPEARANCE
            ================================================== */}
            <section id="appearance">
              <div className="mb-4">
                <h2 className="text-base font-semibold">Appearance</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Choose how BLOCKS looks on your device.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border bg-card">
                {/* Current Theme */}
                <div className="flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        theme === "light"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-indigo-500/10 text-indigo-500",
                      )}
                    >
                      {theme === "light" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Current theme</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {theme === "light"
                          ? "Light appearance is active."
                          : "Dark appearance is active."}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="h-9 gap-2 rounded-lg"
                    onClick={toggleTheme}
                  >
                    {theme === "light" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    Switch to {theme === "light" ? "dark" : "light"}
                  </Button>
                </div>

                {/* Theme Selector */}
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Theme preference</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Select your preferred interface appearance.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-1.5">
                    <div className="grid grid-cols-2 gap-1">
                      {/* Light */}
                      <button
                        type="button"
                        onClick={() => {
                          if (theme !== "light") toggleTheme();
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                          theme === "light"
                            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                        )}
                      >
                        <Sun
                          className={cn(
                            "h-4 w-4",
                            theme === "light" && "text-amber-500",
                          )}
                        />

                        <span>Light</span>

                        {theme === "light" && (
                          <Check className="ml-1 h-4 w-4 text-primary" />
                        )}
                      </button>

                      {/* Dark */}
                      <button
                        type="button"
                        onClick={() => {
                          if (theme !== "dark") toggleTheme();
                        }}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                          theme === "dark"
                            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                        )}
                      >
                        <Moon
                          className={cn(
                            "h-4 w-4",
                            theme === "dark" && "text-indigo-400",
                          )}
                        />

                        <span>Dark</span>

                        {theme === "dark" && (
                          <Check className="ml-1 h-4 w-4 text-primary" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                LANGUAGE
            ================================================== */}
            <section id="language">
              <div className="mb-4">
                <h2 className="text-base font-semibold">Language</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Choose the language used throughout the application.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Globe2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Application language
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Changes are applied immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {languages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Languages className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <p className="text-sm font-medium">
                        No languages available
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        There are currently no language options available.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {languages.map((lang) => {
                        const isSelected = lang.languageCode === language;

                        return (
                          <button
                            key={lang.itemId}
                            onClick={() => setLanguage(lang.languageCode)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all",
                              isSelected
                                ? "bg-primary/[0.06]"
                                : "hover:bg-muted/60",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {/* Language Initial */}
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {lang.languageCode?.slice(0, 2).toUpperCase()}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "text-sm",
                                      isSelected && "font-semibold",
                                    )}
                                  >
                                    {lang.languageName}
                                  </span>

                                  {lang.isDefault && (
                                    <Badge
                                      variant="secondary"
                                      className="h-5 rounded-md px-1.5 text-[10px]"
                                    >
                                      Default
                                    </Badge>
                                  )}
                                </div>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {lang.languageCode}
                                </p>
                              </div>
                            </div>

                            {/* Selected */}
                            <div
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/20",
                              )}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom Information */}
            <div className="flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
              <Monitor className="h-3.5 w-3.5" />
              <span>
                Preferences are stored automatically for your account.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
// import { Moon, Sun } from "lucide-react";
// import AppLayout from "@/components/AppLayout";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useTheme } from "@/context/ThemeContext";
// import { useLanguage } from "@/context/LanguageContext";
// import { useLanguages } from "@/hooks/useLanguages";
// import { cn } from "@/lib/utils";

// export default function Settings() {
//   const { theme, toggleTheme } = useTheme();
//   const { language, setLanguage } = useLanguage();
//   const { data: languages = [] } = useLanguages();

//   return (
//     <AppLayout>
//       <div className="mx-auto max-w-2xl space-y-4">
//         <h1 className="mb-6 text-xl font-medium">Settings</h1>

//         <div className="rounded-xl border bg-card p-5">
//           <h2 className="mb-1 text-sm font-medium text-muted-foreground">Appearance</h2>
//           <div className="flex items-center justify-between border-t pt-3 mt-3">
//             <div>
//               <div className="text-sm font-medium">Theme</div>
//               <div className="text-sm text-muted-foreground">
//                 {theme === "light" ? "Light" : "Dark"} mode is currently active
//               </div>
//             </div>
//             <Button variant="outline" size="sm" className="gap-1.5" onClick={toggleTheme}>
//               {theme === "light" ? (
//                 <Sun className="h-4 w-4" />
//               ) : (
//                 <Moon className="h-4 w-4" />
//               )}
//               Switch to {theme === "light" ? "dark" : "light"}
//             </Button>
//           </div>
//         </div>

//         <div className="rounded-xl border bg-card p-5">
//           <h2 className="mb-1 text-sm font-medium text-muted-foreground">Language</h2>
//           <div className="mt-3 flex flex-col gap-1 border-t pt-3">
//             {languages.length === 0 && (
//               <p className="text-sm text-muted-foreground">No languages available.</p>
//             )}
//             {languages.map((lang) => (
//               <button
//                 key={lang.itemId}
//                 onClick={() => setLanguage(lang.languageCode)}
//                 className={cn(
//                   "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted",
//                   lang.languageCode === language && "bg-muted"
//                 )}
//               >
//                 <span className={lang.languageCode === language ? "font-medium" : undefined}>
//                   {lang.languageName}
//                 </span>
//                 <div className="flex items-center gap-1.5">
//                   {lang.isDefault && <Badge variant="secondary">Default</Badge>}
//                   {lang.languageCode === language && (
//                     <Badge variant="outline">Selected</Badge>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }
