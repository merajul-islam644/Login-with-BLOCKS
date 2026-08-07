import { Moon, Sun } from "lucide-react";
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
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="mb-6 text-xl font-medium">Settings</h1>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">Appearance</h2>
          <div className="flex items-center justify-between border-t pt-3 mt-3">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">
                {theme === "light" ? "Light" : "Dark"} mode is currently active
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={toggleTheme}>
              {theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              Switch to {theme === "light" ? "dark" : "light"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">Language</h2>
          <div className="mt-3 flex flex-col gap-1 border-t pt-3">
            {languages.length === 0 && (
              <p className="text-sm text-muted-foreground">No languages available.</p>
            )}
            {languages.map((lang) => (
              <button
                key={lang.itemId}
                onClick={() => setLanguage(lang.languageCode)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted",
                  lang.languageCode === language && "bg-muted"
                )}
              >
                <span className={lang.languageCode === language ? "font-medium" : undefined}>
                  {lang.languageName}
                </span>
                <div className="flex items-center gap-1.5">
                  {lang.isDefault && <Badge variant="secondary">Default</Badge>}
                  {lang.languageCode === language && (
                    <Badge variant="outline">Selected</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
