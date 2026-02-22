import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope } from "lucide-react";
export default async function DoctorsPage() {
  return (
    <>
<div className="flex justify-between mb-8">
  {/* Left Button */}
  <div>
    <Button
      asChild
      size="lg"
      className="bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
    >
      <Link href="/patient/medical-profile">
        Health-Check <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </div>

  {/* Right Button */}
  <div>
    <Button
      asChild
      size="lg"
      className="bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
    >
      <Link href="/patient/heart-assessment">
        Decease-risk <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </div>
</div>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        
        <h1 className="text-3xl font-bold text-white mb-2">Find Your Doctor</h1>
        <p className="text-muted-foreground text-lg">
          Browse by specialty or view all available healthcare providers
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((specialty) => (
          <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
            <Card className="hover:border-emerald-700/40 transition-all cursor-pointer border-emerald-900/20 h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4">
                  <div className="text-emerald-400">{specialty.icon}</div>
                </div>
                <h3 className="font-medium text-white">{specialty.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}