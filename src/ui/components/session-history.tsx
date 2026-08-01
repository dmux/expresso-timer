import type { SessionRecord } from "@/application/ports"
import { PHASE_LABELS } from "@/domain/timer/phase"
import { ScrollArea } from "@/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table"

type SessionHistoryProps = {
  history: readonly SessionRecord[]
}

export function SessionHistory({ history }: SessionHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="py-[calc(var(--px)*6)] text-center text-[calc(var(--px)*2.5)] text-[var(--px-text-muted)]">
        Nenhuma sessão ainda.
      </p>
    )
  }

  return (
    <ScrollArea className="h-[calc(var(--px)*60)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fase</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Quando</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((record) => (
            <TableRow key={record.completedAt}>
              <TableCell>{PHASE_LABELS[record.phase]}</TableCell>
              <TableCell>
                {Math.round(record.elapsedMs / 60_000)} min
                {!record.ranToCompletion && (
                  <span className="text-[var(--px-text-muted)]"> (pulado)</span>
                )}
              </TableCell>
              <TableCell className="text-[var(--px-text-muted)]">
                {formatTime(record.completedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function formatTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
