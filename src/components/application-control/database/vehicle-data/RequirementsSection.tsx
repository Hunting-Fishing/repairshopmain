
export function RequirementsSection() {
  return (
    <div className="text-sm text-muted-foreground">
      <p>File requirements:</p>
      <ul className="list-disc list-inside ml-2">
        <li>JSON format</li>
        <li>Array of objects with year, make, and model properties</li>
        <li>Example: [{'"year": "2024", "make": "Toyota", "model": "Camry"'}]</li>
      </ul>
    </div>
  );
}
