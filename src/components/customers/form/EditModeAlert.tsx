
export function EditModeAlert() {
  return (
    <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="text-yellow-700">
        <p className="text-sm font-medium">Edit Mode</p>
        <p className="text-xs">You are currently editing this customer's information.</p>
      </div>
    </div>
  );
}
