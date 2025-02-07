
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { marketingItems } from "./constants";

export function MarketingCarousel() {
  return (
    <div className="mt-auto px-4 py-6">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {marketingItems.map((item, index) => (
            <CarouselItem key={index}>
              <Link to={item.path}>
                <Card className={`${item.color} text-white hover:opacity-90 transition-opacity`}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-6 w-6" />
        <CarouselNext className="h-6 w-6" />
      </Carousel>
    </div>
  );
}
