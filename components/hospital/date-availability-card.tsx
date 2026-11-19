"use client"

import { useEffect, useState } from "react"
import { Clock, Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { DoctorSession, DoctorDateSchedule } from "@/lib/api"
import { formatDate, toDate } from "@/lib/date"
import { cn } from "@/lib/utils"

type DateAvailabilityCardProps = {
  dateKey: string
  schedule?: DoctorDateSchedule | null
  token?: string
  onSave: (date: string, isActive: boolean, sessions: DoctorSession[], token?: string) => Promise<boolean>
}

export function DateAvailabilityCard({ dateKey, schedule, token, onSave }: DateAvailabilityCardProps) {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [sessions, setSessions] = useState<DoctorSession[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync state when dateKey or schedule changes
  useEffect(() => {
    if (schedule) {
      setIsActive(schedule.isActive)
      setSessions(schedule.sessions || [])
    } else {
      setIsActive(false)
      setSessions([])
    }
    setHasChanges(false)
  }, [dateKey, schedule])

  const formattedDate = formatDate(toDate(dateKey), "EEEE, d MMMM yyyy")

  function handleToggle(active: boolean) {
    setIsActive(active)
    setHasChanges(true)
    if (active && sessions.length === 0) {
      // Provide an initial session when turning on
      setSessions([{ startTime: "09:00", endTime: "12:00" }])
    }
  }

  function handleAddSession() {
    let nextStart = "13:30"
    let nextEnd = "16:00"

    const lastSession = sessions[sessions.length - 1]
    if (lastSession) {
      if (lastSession.endTime < "17:00") {
        nextStart = lastSession.endTime
        const parts = lastSession.endTime.split(":")
        const h = Number(parts[0] ?? "13")
        const m = parts[1] ?? "00"
        const endH = Math.min(20, h + 2)
        nextEnd = `${endH.toString().padStart(2, "0")}:${m}`
      }
    }

    setSessions([...sessions, { startTime: nextStart, endTime: nextEnd }])
    setHasChanges(true)
  }

  function handleRemoveSession(index: number) {
    const updated = sessions.filter((_, i) => i !== index)
    setSessions(updated)
    setHasChanges(true)
  }

  function handleTimeChange(index: number, field: "startTime" | "endTime", value: string) {
    const updated = sessions.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    setSessions(updated)
    setHasChanges(true)
  }

  async function handleSave() {
    if (isActive) {
      // Validate session times
      for (let i = 0; i < sessions.length; i++) {
        const s = sessions[i]
        if (!s || !s.startTime || !s.endTime) {
          toast.error(`Session ${i + 1} has an empty time.`)
          return
        }
        if (s.startTime >= s.endTime) {
          toast.error(`Session ${i + 1} start time must be earlier than end time.`)
          return
        }
      }
    }

    setIsSaving(true)
    try {
      await onSave(dateKey, isActive, isActive ? sessions : [], token)
      setHasChanges(false)
      toast.success(`Availability saved for ${formatDate(toDate(dateKey), "d MMM yyyy")}`)
    } catch (err) {
      toast.error((err as Error).message || "Failed to save availability")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border bg-card shadow-xs">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h2 className="type-subheading text-base font-semibold">Consultation Hours</h2>
          </div>
          <p className="type-caption mt-0.5 text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Switch id="date-active-toggle" checked={isActive} onCheckedChange={handleToggle} />
          <Label htmlFor="date-active-toggle" className="cursor-pointer text-sm font-medium">
            {isActive ? "Available" : "Unavailable"}
          </Label>
        </div>
      </header>

      <div className="p-5">
        {isActive ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sessions on this date ({sessions.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSession}
                className="h-8 gap-1.5 rounded-lg text-xs"
              >
                <Plus className="size-3.5" />
                Add Session
              </Button>
            </div>

            {sessions.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                <p>No consultation sessions configured for this date.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSession}
                  className="mt-3 gap-1.5"
                >
                  <Plus className="size-3.5" />
                  Add First Session
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-foreground">Session {index + 1}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={session.startTime}
                        aria-label={`Session ${index + 1} start time`}
                        onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                        className="h-9 w-28 bg-card text-xs font-medium"
                      />
                      <span className="text-xs text-muted-foreground" aria-hidden="true">
                        to
                      </span>
                      <Input
                        type="time"
                        value={session.endTime}
                        aria-label={`Session ${index + 1} end time`}
                        onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                        className="h-9 w-28 bg-card text-xs font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove Session ${index + 1}`}
                        onClick={() => handleRemoveSession(index)}
                        className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            <p>Consultations are disabled for {formattedDate}.</p>
            <p className="mt-1 text-xs">Switch the toggle above to enable consultations and add sessions.</p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            {hasChanges ? (
              <span className="text-warning font-medium">Unsaved changes</span>
            ) : schedule ? (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="size-3.5" /> Saved to database
              </span>
            ) : (
              <span>No schedule saved yet</span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save Availability
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
