import { integrationCategories } from "./integrations/integrationData";
import { IntegrationCategory } from "./integrations/IntegrationCategory";

export function IntegrationsTab() {
  return (
    <div className="space-y-8">
      {Object.values(integrationCategories).map((category) => (
        <IntegrationCategory 
          key={category.title} 
          title={category.title} 
          items={category.items} 
        />
      ))}
    </div>
  );
}