export type NextActionKey =
  | "CHANGE_REQUEST_REVIEW"
  | "PAYMENT_DUE"
  | "WAITING_FOR_CLIENT_APPROVAL"
  | "NO_ACTION";

type MilestoneStatusKey = "PENDING" | "IN_PROGRESS" | "COMPLETED";
type ProjectStatusKey = "ACTIVE" | "COMPLETED" | "CANCELLED";

type NextActionInput = {
  status: ProjectStatusKey;
  milestones: { status: MilestoneStatusKey }[];
  booking?: { budgetBDT?: number | null; budgetUSD?: number | null } | null;
  payments: { amountBDT?: number | null; amountUSD?: number | null }[];
  pendingChangeRequests?: number;
};

export type NextAction = {
  key: NextActionKey;
};

function isPaymentDue(input: NextActionInput): boolean {
  const totalPaidBDT = input.payments.reduce(
    (sum, payment) => sum + (payment.amountBDT ?? 0),
    0,
  );
  const totalPaidUSD = input.payments.reduce(
    (sum, payment) => sum + (payment.amountUSD ?? 0),
    0,
  );

  const budgetBDT = input.booking?.budgetBDT ?? null;
  const budgetUSD = input.booking?.budgetUSD ?? null;

  const hasBudgetBDT = typeof budgetBDT === "number" && budgetBDT > 0;
  const hasBudgetUSD = typeof budgetUSD === "number" && budgetUSD > 0;

  return (
    (hasBudgetBDT && totalPaidBDT < budgetBDT) ||
    (hasBudgetUSD && totalPaidUSD < budgetUSD)
  );
}

function isWaitingForClientApproval(input: NextActionInput): boolean {
  if (input.status !== "ACTIVE") return false;

  const milestones = input.milestones;
  if (milestones.length === 0) return false;

  const hasInProgress = milestones.some((m) => m.status === "IN_PROGRESS");
  const hasCompleted = milestones.some((m) => m.status === "COMPLETED");
  const hasPending = milestones.some((m) => m.status === "PENDING");
  const allCompleted = milestones.every((m) => m.status === "COMPLETED");

  return !hasInProgress && hasCompleted && (hasPending || allCompleted);
}

export function getNextAction(input: NextActionInput): NextAction {
  const pendingChangeRequests = input.pendingChangeRequests ?? 0;

  if (pendingChangeRequests > 0) {
    return { key: "CHANGE_REQUEST_REVIEW" };
  }

  if (isPaymentDue(input)) {
    return { key: "PAYMENT_DUE" };
  }

  if (isWaitingForClientApproval(input)) {
    return { key: "WAITING_FOR_CLIENT_APPROVAL" };
  }

  return { key: "NO_ACTION" };
}
