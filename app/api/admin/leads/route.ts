import {NextRequest, NextResponse} from 'next/server';
import {getAdminToken} from '@/lib/auth';
import {
  getDemoMode,
  getLeads,
  saveLead,
  updateLeadStatus,
  type Lead,
} from '@/lib/kv';

async function requireAuth(request: NextRequest) {
  return getAdminToken(request);
}

export async function GET(request: NextRequest) {
  try {
    const token = await requireAuth(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const leads = await getLeads();
    const unreadCount = leads.filter(lead => lead.status === 'new').length;

    return NextResponse.json({leads, unreadCount});
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({error: 'Failed to fetch leads'}, {status: 500});
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await requireAuth(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const body = await request.json();
    const {name, companyName, email, phone, service, message, locale} = body;

    if (!name || !phone || !service || !message) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    const isDemo = await getDemoMode();
    if (isDemo) {
      return NextResponse.json({
        success: true,
        demo: true,
        id: `demo-lead:${Date.now()}`,
      });
    }

    const id = await saveLead({
      name: String(name),
      companyName: String(companyName || ''),
      email: String(email || ''),
      service: String(service),
      phone: String(phone || ''),
      message: String(message),
      locale: locale === 'fa' ? 'fa' : 'en',
      status: 'new',
    });

    return NextResponse.json({success: true, id});
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({error: 'Failed to save lead'}, {status: 500});
  }
}

const STATUS_CYCLE: Record<Lead['status'], Lead['status']> = {
  new: 'read',
  read: 'replied',
  replied: 'new',
};

export async function PATCH(request: NextRequest) {
  try {
    const token = await requireAuth(request);
    if (!token) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {id, status, cycle, currentStatus} = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({error: 'Lead id is required'}, {status: 400});
    }

    const isDemo = await getDemoMode();
    if (isDemo) {
      if (cycle === true) {
        const base: Lead['status'] =
          currentStatus === 'read' || currentStatus === 'replied'
            ? currentStatus
            : 'new';
        return NextResponse.json({
          success: true,
          demo: true,
          status: STATUS_CYCLE[base],
        });
      }
      const demoStatus =
        status === 'new' || status === 'read' || status === 'replied'
          ? status
          : 'new';
      return NextResponse.json({success: true, demo: true, status: demoStatus});
    }

    let nextStatus: Lead['status'];

    if (cycle === true) {
      const leads = await getLeads();
      const lead = leads.find(item => item.id === id);
      if (!lead) {
        return NextResponse.json({error: 'Lead not found'}, {status: 404});
      }
      nextStatus = STATUS_CYCLE[lead.status];
    } else if (status === 'new' || status === 'read' || status === 'replied') {
      nextStatus = status;
    } else {
      return NextResponse.json({error: 'Invalid status'}, {status: 400});
    }

    await updateLeadStatus(id, nextStatus);
    return NextResponse.json({success: true, status: nextStatus});
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json({error: 'Failed to update lead'}, {status: 500});
  }
}
