
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerTagsProps {
  tags: string[];
}

export function CustomerTags({ tags }: CustomerTagsProps) {
  if (!tags?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
