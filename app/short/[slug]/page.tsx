"use server";

import { redirect } from 'next/navigation';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ShortLinkRedirect({ params }: PageProps) {
  // Get the slug from the URL path parameters
  const { slug } = params;
  
  if (!slug) {
    redirect('/'); // Redirect to home page if no slug is provided
  }

  try {
    // Query the database for the URL associated with the slug
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT url FROM links WHERE slug = $1',
        [slug]
      );
      
      if (result.rows.length === 0) {
        // Slug not found, redirect to home page or error page
        redirect('/');
      }
      
      // Redirect to the target URL
      const targetUrl = result.rows[0].url;
      redirect(targetUrl);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error retrieving short link:', error);
    redirect('/'); // Redirect to home page on error
  }
  
  // This should never be reached due to redirects
  return null;
}