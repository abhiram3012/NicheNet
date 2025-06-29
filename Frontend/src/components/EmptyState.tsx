// components/EmptyState.jsx
import { FileQuestion, BarChart3, HelpCircle } from "lucide-react";

export function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="text-center py-10 text-gray-400">
      <div className="flex justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-sm mt-2 text-gray-400">{message}</p>
    </div>
  );
}
