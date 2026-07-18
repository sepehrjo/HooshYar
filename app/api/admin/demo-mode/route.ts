import {NextRequest, NextResponse} from 'next/server';
import {getAdminToken} from '@/lib/auth';
import {getDemoMode, setDemoMode} from '@/lib/kv';

export async function GET(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const enabled = await getDemoMode();
    return NextResponse.json({enabled});
  } catch (error) {
    console.error('Error fetching demo mode:', error);
    return NextResponse.json(
      {error: 'Failed to fetch demo mode'},
      {status: 500}
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {enabled} = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        {error: 'Invalid request body'},
        {status: 400}
      );
    }

    await setDemoMode(enabled);
    return NextResponse.json({success: true, enabled});
  } catch (error) {
    console.error('Error setting demo mode:', error);
    return NextResponse.json(
      {error: 'Failed to set demo mode'},
      {status: 500}
    );
  }
}
