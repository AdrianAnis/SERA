export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID")
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} mnt`
  return minutes === 0 ? `${hours} j` : `${hours} j ${minutes} mnt`
}
