import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AmcPlanForm, { emptyAmcPlanForm } from "@/components/admin/AmcPlanForm";

export default function NewAmcPlanPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <Breadcrumbs items={[{ label: "AMC Plans", href: "/admin/amc-plans" }, { label: "New Plan" }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight">New AMC Plan</h1>
      <AmcPlanForm initial={emptyAmcPlanForm()} />
    </div>
  );
}
