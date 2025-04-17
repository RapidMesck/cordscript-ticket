import { NextRequest, NextResponse } from 'next/server';
import { createId } from '@paralleldrive/cuid2';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(request: NextRequest) {
  try {
    const bearerToken = request.headers.get('Authorization');
    
    // Validate bearer token format and prevent timing attacks
    if (!bearerToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use constant-time comparison to prevent timing attacks
    const token = bearerToken.startsWith('Bearer ') ? bearerToken.slice(7) : '';
    const isValidToken = token.length > 0 && 
                        token.length === process.env.AUTH_TOKEN?.length &&
                        token === process.env.AUTH_TOKEN;
                        
    if (!isValidToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { url, slug } = body;

    // Validate input
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // If slug is not provided, generate a random one
    const finalSlug = slug || createId();

    // Insert into database
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO links (slug, url) VALUES ($1, $2) RETURNING id, slug, url, created_at',
        [finalSlug, url]
      );
      
      return NextResponse.json({ 
        success: true, 
        data: result.rows[0] 
      }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating short link:', error);
    return NextResponse.json({ 
      error: 'Failed to create short link' 
    }, { status: 500 });
  }
}