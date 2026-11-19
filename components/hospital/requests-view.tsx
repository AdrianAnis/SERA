"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  UserCheck,
  X,
  XCircle,
} from "lucide-react"

import { PageHeader } from "@/components/hospital/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthStore } from "@/features/auth/store"
import { consultationApi, type ConsultationRequestItem } from "@/lib/api"
import { formatDate } from "@/lib/date"
import { routes } from "@/lib/routes"
import { getInitials } from "@/lib/utils"

export function RequestsView() {
  const router = useRouter()
  const doctorSession = useAuthStore((state) => state.doctor)
  const [requests, setRequests] = useState<ConsultationRequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadRequests() {
      try {
        setIsLoading(true)
        const data = await consultationApi.getDoctorRequests(doctorSession?.token)
        if (isMounted) setRequests(data)
      } catch (err) {
        console.error("Gagal memuat permintaan konsultasi:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadRequests()
    return () => {
      isMounted = false
    }
  }, [doctorSession?.token])

  async function handleReject(requestId: string) {
    if (!confirm("Are you sure you want to reject this consultation request?")) return
    setRejectingId(requestId)
    setFeedback(null)

    try {
      await consultationApi.rejectRequest(requestId, doctorSession?.token)
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      )
      setFeedback({
        type: "success",
        message: "The consultation request has been rejected.",
      })
    } catch (err) {
      console.error("Gagal menolak permintaan:", err)
      setFeedback({
        type: "error",
        message: (err as Error).message || "Failed to reject the request.",
      })
    } finally {
      setRejectingId(null)
    }
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.notes && req.notes.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = requests.filter((r) => r.status === "pending").length

  return (
    <>
      <PageHeader
        title="Requests"
        description={`${pendingCount} consultation request(s) awaiting your confirmation.`}
      />

      <div className="space-y-4 p-4 md:p-6">
        {feedback ? (
          <div
            className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-sm font-medium shadow-sm animate-in fade-in ${
              feedback.type === "success"
                ? "border-emerald-500/30 bg-emerald-50/80 text-emerald-900"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            <span>{feedback.message}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFeedback(null)}
              className="size-7 p-0 rounded-full"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Label htmlFor="request-search" className="sr-only">
              Search requests
            </Label>
            <Search className="absolute top-3 left-3.5 size-4 text-muted-foreground" />
            <Input
              id="request-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, email, or complaint..."
              className="bg-card pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger aria-label="Filter request status" className="w-full bg-card sm:w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Awaiting confirmation</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border bg-card">
          <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs font-medium text-muted-foreground md:grid">
            <span className="col-span-4">Patient</span>
            <span className="col-span-3">Notes / Complaint</span>
            <span className="col-span-2">Requested at</span>
            <span className="col-span-3 text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="p-10 text-center type-caption">No matching consultation requests.</p>
          ) : (
            <ul className="divide-y">
              {filteredRequests.map((req) => {
                const dateObj = new Date(req.createdAt)
                const formattedDate = !isNaN(dateObj.getTime())
                  ? formatDate(dateObj, "d MMM yyyy, HH:mm")
                  : req.createdAt

                return (
                  <li
                    key={req.id}
                    className="grid items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 md:grid-cols-12 md:gap-4"
                  >
                    {/* Patient info */}
                    <div className="flex items-center gap-3 md:col-span-4">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(req.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{req.userName}</p>
                        <p className="type-caption truncate">
                          {req.userEmail} {req.userPhone ? `· ${req.userPhone}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Notes / Complaint */}
                    <div className="text-sm md:col-span-3">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {req.notes || "Online consultation request."}
                      </p>
                    </div>

                    {/* Request date & Scheduled Slot */}
                    <div className="md:col-span-2 space-y-1">
                      {req.scheduledDate && req.scheduledTime ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Clock className="size-3.5 shrink-0" />
                          <span>{req.scheduledDate} · {req.scheduledTime}</span>
                        </div>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 md:col-span-3">
                      {req.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={rejectingId === req.id}
                            onClick={() => handleReject(req.id)}
                            className="size-9 p-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                            title="Reject request"
                            aria-label="Reject request"
                          >
                            {rejectingId === req.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <X className="size-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            asChild
                            className="h-9 px-3.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm gap-1.5 text-xs font-semibold"
                            title="Accept & create medical record"
                            aria-label="Accept & create medical record"
                          >
                            <Link href={routes.hospital.requestRecord(req.id)}>
                              <Check className="size-4" />
                              <span>Accept</span>
                            </Link>
                          </Button>
                        </>
                      ) : req.status === "approved" ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 gap-1.5 px-3 py-1 text-xs"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                          Accepted
                        </Badge>
                      ) : req.status === "rejected" ? (
                        <Badge
                          variant="outline"
                          className="border-destructive/30 bg-destructive/10 text-destructive gap-1.5 px-3 py-1 text-xs"
                        >
                          <XCircle className="size-3.5" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

