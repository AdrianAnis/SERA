import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/patient", request.url))
}

export const config = {
  matcher: "/",
}
