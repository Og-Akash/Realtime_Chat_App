import { useThemeStore } from "@/store/useThemeStore";
import { THEMES } from "@/constants/index";
import { LockIcon, MessageCircle, User, Volume2 } from "lucide-react";
const Setting = () => {
  const { setTheme, theme } = useThemeStore();
  return (
    <section className="h-[95%] p-8">
      <main className="max-w-5xl mx-auto p-4 rounded-md space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold"> Settings Page</h1>
          <p className="text-base text-accent">
            Change Themes, Sound Effects, Privacy & Language
          </p>
        </div>

        {/* Themes */}

        <div>
          <label className="label text-xl font-medium">Themes:</label>

          <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-4">
            {" "}
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                cursor-pointer group flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
                onClick={() => setTheme(t)}
              >
                <div
                  className="relative h-10 w-full rounded-md overflow-hidden"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 justify-center gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-sm font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}

        <div className="flex flex-col sm:flex-row justify-between mt-3 lg:mt-6">
          <label htmlFor="font-size" className="label text-xl font-medium">
            Font Size:
          </label>
          <select
            name="font-size"
            id="font-size"
            defaultValue="select your font Size"
            className="select select-accent"
          >
            <option disabled={true}>select your font Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Sound */}

        <div className="flex justify-between mt-3 lg:mt-6">
          <label htmlFor="font-size" className="label text-xl font-medium">
            Sound:
          </label>
          <div className="flex gap-3 items-center">
            <Volume2 />
            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-accent"
            />
          </div>
        </div>

        {/* Privacy */}

        <div className="space-y-4">
          <label htmlFor="font-size" className="label text-xl font-medium">
            Privacy:
          </label>
          <div className="flex flex-col gap-3 space-y-2">
            <div className="flex gap-2 items-center justify-between">
              <div className="inline-flex gap-2 items-center">
                <LockIcon className="text-accent" />
                <span className="font-medium text-lg">Read Receipts</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-accent"
              />
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="inline-flex gap-2 items-center">
                <User className="text-accent" />
                <span className="font-medium text-lg">Last Seen</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-accent"
              />
            </div>
            <div className="flex gap-2 items-center justify-between">
              <div className="inline-flex gap-2 items-center">
                <MessageCircle className="text-accent" />
                <span className="font-medium text-lg">Show Typing</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-accent"
              />
            </div>
          </div>
        </div>

        {/* Language */}

        <div className="flex flex-col sm:flex-row justify-between">
          <label htmlFor="language" className="label font-medium text-xl">
            Language:
          </label>
          <select name="language" id="language" defaultValue="Select your language" className="select select-accent mt-2">
            <option disabled={true}>Select your language</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </main>
    </section>
  );
};

export default Setting;
