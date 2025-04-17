import { NextResponse } from "next/server"
import { Pool } from "pg"

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const client = await pool.connect()
    let targetUrl = "/"

    try {
      const result = await client.query("SELECT url FROM links WHERE slug = $1", [slug])

      if (result.rows.length > 0) {
        targetUrl = result.rows[0].url
      }
    } finally {
      client.release()
    }

    return NextResponse.redirect(new URL(targetUrl, request.url))
  } catch (error) {
    console.error("Error retrieving short link:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
