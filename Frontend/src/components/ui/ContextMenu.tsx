import { Copy, Edit, Fullscreen, ImageDown, Trash } from "lucide-react";
import { useEffect, useRef } from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  type: string;
  onClose: () => void;
  onCopy: () => void;
  handleDownloadImage: () => void;
};

const ContextMenu = ({
  x,
  y,
  type,
  onClose,
  onCopy,
  handleDownloadImage,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="absolute"
      style={{ left: `${x}px`, top: `${y}px`, zIndex: 50 }}
    >
      <ul
        ref={menuRef}
        className="menu menu-sm bg-base-100 rounded-lg border-2 border-gray-900/40 w-52"
      >
        <li>
          <button
            onClick={() => console.log("Delete clicked")}
            className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
          >
            <Trash size={18} />
            Delete
          </button>
        </li>

        {type === "image" ? (
          <>
            <li>
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
              >
                <ImageDown size={18} />
                Download
              </button>
            </li>
            <li>
              <button
                onClick={() => console.log("View clicked")}
                className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
              >
                <Fullscreen size={18} />
                View
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button
                onClick={() => console.log("Edit clicked")}
                className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
              >
                <Edit size={16} />
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={onCopy}
                className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
              >
                <Copy size={16} />
                Copy
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
export default ContextMenu;
