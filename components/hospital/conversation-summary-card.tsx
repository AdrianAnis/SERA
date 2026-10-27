import { MessageCircleMore } from "lucide-react"

import { StatusDot } from "@/components/status-dot"
import { CONVERSATION_CATEGORY_LABEL, QUESTION_SCOPE_LABEL } from "@/features/companion/labels"
import type { ConversationSummary } from "@/features/companion/types"
import { formatDateTime } from "@/lib/date"

type ConversationSummaryCardProps = {
  patientName: string
  summary: ConversationSummary
}

function describeCounts(summary: ConversationSummary): string {
  if (summary.totalMessages === 0) return "Belum ada percakapan."
  return summary.escalatedCount > 0
    ? `${summary.totalMessages} pesan · ${summary.escalatedCount} diteruskan ke dokter`
    : `${summary.totalMessages} pesan · semuanya terjawab Companion`
}

export function ConversationSummaryCard({ patientName, summary }: ConversationSummaryCardProps) {
  return (
    <section className="flex flex-col rounded-2xl border bg-card xl:h-0 xl:min-h-full">
      <header className="flex shrink-0 items-start gap-3 border-b px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageCircleMore className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="type-subheading">Percakapan dengan Companion</h2>
          <p className="type-caption">{describeCounts(summary)}</p>
        </div>
      </header>

      {summary.totalMessages === 0 ? (
        <p className="p-8 text-center type-caption">{patientName} belum berbincang dengan Companion.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="flex flex-wrap gap-1.5 px-5 pt-4" aria-label="Topik percakapan">
            {summary.categoryCounts.map(({ category, count }) => (
              <li key={category} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {CONVERSATION_CATEGORY_LABEL[category]} {count}
              </li>
            ))}
          </ul>
          <ul className="divide-y px-5">
            {summary.entries.map((entry) => (
              <li key={entry.id} className="space-y-1 py-3.5">
                <p className="text-sm">{entry.content}</p>
                <p className="type-caption">
                  {CONVERSATION_CATEGORY_LABEL[entry.category]} · {formatDateTime(entry.createdAt)}
                </p>
                {entry.scope !== "in-scope" ? <StatusDot tone={entry.scope === "urgent" ? "destructive" : "warning"} label={QUESTION_SCOPE_LABEL[entry.scope]} /> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
