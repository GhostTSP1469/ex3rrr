import { useNavigate } from "react-router-dom";
import { useNotifStore, type Notif, type NotifType } from "../store/notificationsStore";

const styleMap: Record<NotifType, { box: string; icon: string; label: string }> = {
  add: {
    box: "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800",
    icon: "text-green-600",
    label: "Added",
  },
  info: {
    box: "bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800",
    icon: "text-blue-600",
    label: "Info",
  },
  edit: {
    box: "bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    icon: "text-yellow-600",
    label: "Edited",
  },
  delete: {
    box: "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800",
    icon: "text-red-600",
    label: "Deleted",
  },
};

function InfoIcon({ className }: { className: string }) {
  return (
    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NotificationsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useNotifStore((state) => state.items);
  const clear = useNotifStore((state) => state.clear);
  const setHighlight = useNotifStore((state) => state.setHighlight);
  const navigate = useNavigate();

  if (!open) return null;

  function openProduct(notif: Notif) {
    if ((notif.type === "add" || notif.type === "edit") && notif.productId) {
      setHighlight({ id: notif.productId, type: notif.type });
      onClose();
      navigate("/admin/products");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-5 py-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
          <div className="flex items-center gap-4">
            <button type="button" onClick={clear} className="text-xs font-medium text-slate-500 hover:text-red-500">
              Clear
            </button>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No activity yet.</p>
          ) : (
            items.map((notif) => {
              const style = styleMap[notif.type];
              const clickable = (notif.type === "add" || notif.type === "edit") && Boolean(notif.productId);
              return (
                <div
                  key={notif.id}
                  role="alert"
                  onClick={() => openProduct(notif)}
                  className={`flex items-center rounded-lg border-l-4 p-2 transition duration-300 ease-in-out ${style.box} ${
                    clickable ? "transform cursor-pointer hover:scale-[1.02]" : ""
                  }`}
                >
                  <InfoIcon className={`mr-2 h-5 w-5 flex-shrink-0 ${style.icon}`} />
                  <p className="text-xs font-semibold">
                    {style.label} — {notif.message}
                    {clickable ? " → открыть товар" : ""}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
