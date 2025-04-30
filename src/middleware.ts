import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from './lib/db/db';
import { auth } from './auth';

export async function middleware(req: NextRequest) {
 
 const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const result = await pool.query(
      `SELECT * FROM sessions WHERE "sessionToken" = $1 AND expires > NOW()`,
      [session.sessionToken]
    );

    if (result.rows.length === 0) {
    
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware DB error:', error);
    return NextResponse.redirect(new URL('/api/auth/error', req.url));
  }
}

export const config = {
  matcher: ['/dashboard'],
};
