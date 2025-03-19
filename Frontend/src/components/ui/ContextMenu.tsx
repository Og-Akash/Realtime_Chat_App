import { Copy, Edit, FileDown, Fullscreen, Trash } from "lucide-react";
import { useEffect, useRef } from "react";

type ContextMenuProps = {
  x: number;
  y: number;
  type: string;
  onClose: () => void;
  onCopy: () => void;
  onDownloadImage: () => void;
};

const ContextMenu = ({
  x,
  y,
  type,
  onClose,
  onCopy,
  onDownloadImage,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      className={`dropdown dropdown-open absolute z-10`}
      style={{ left: `${x}px`, top: `${y}px` }}
      ref={menuRef}
    >
      <ul className="menu menu-sm bg-base-100 rounded-lg border-2 border-gray-900/40 w-52">
        <li>
          <button className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent">
            <Trash size={16} />
            Delete
          </button>
        </li>
        {type === "image" ? (
          <>
            <li>
              <button
                onClick={onDownloadImage}
                className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent"
              >
                <FileDown size={16} />
                Download
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent">
                <Fullscreen size={16} />
                View
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button className="flex items-center gap-3 h-10 text-base hover:bg-accent-content hover:text-accent">
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
