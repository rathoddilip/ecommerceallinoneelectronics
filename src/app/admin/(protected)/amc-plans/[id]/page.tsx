import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeAmcPlan } from "@/lib/serializers";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AmcPlanForm, { amcPlanToForm } from "@/components/admin/AmcPlanForm";

export default async function EditAmcPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.amcPlan.findUnique({ where: { id } });
  if (!row) notFound();
  const plan = serializeAmcPlan(row);

  return (
    <div className="space-y-5 max-w-2xl">
      <Breadcrumbs items={[{ label: "AMC Plans", href: "/admin/amc-plans" }, { label: plan.name }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight">Edit AMC Plan</h1>
      <AmcPlanForm initial={amcPlanToForm(plan)} planId={plan.id} />
    </div>
  );
}
