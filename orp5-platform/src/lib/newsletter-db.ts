
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const supabase: any = getSupabaseAdmin();

export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed';

export async function addSubscriber(email: string) {
    // Check if exists
    const { data: existing } = await supabase
        .from('Subscriber' as any)
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (existing) {
        if (existing.status === 'confirmed') {
            return { status: 'already_confirmed', subscriber: existing };
        }
        // Resend confirmation logic if needed, simplify for now: return existing to trigger resend
        return { status: 'pending_exists', subscriber: existing };
    }

    const token = crypto.randomUUID();
    const { data, error } = await supabase
        .from('Subscriber' as any)
        .insert({
            id: crypto.randomUUID(),
            email,
            status: 'pending',
            token
        })
        .select()
        .single();

    if (error) throw error;
    return { status: 'created', subscriber: data };
}

export async function verifySubscriber(token: string) {
    const { data, error } = await supabase
        .from('Subscriber' as any)
        .select('*')
        .eq('token', token)
        .maybeSingle();

    if (!data || error) return false;

    await supabase
        .from('Subscriber' as any)
        .update({ status: 'confirmed', confirmedAt: new Date().toISOString(), token: null }) // Consume token
        .eq('id', data.id);

    return true;
}

export async function getConfirmedSubscribers() {
    const { data } = await supabase
        .from('Subscriber' as any)
        .select('email')
        .eq('status', 'confirmed');
    return data?.map((s: any) => s.email) || [];
}

export async function createNewsletter(subject: string, content: string) {
    const { data, error } = await supabase
        .from('Newsletter' as any)
        .insert({
            id: crypto.randomUUID(),
            subject,
            content,
            status: 'draft'
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function markNewsletterSent(id: string, count: number) {
    await supabase
        .from('Newsletter' as any)
        .update({ status: 'sent', sentAt: new Date().toISOString(), recipientCount: count })
        .eq('id', id);
}

export async function getNewsletters() {
    const { data } = await supabase
        .from('Newsletter' as any)
        .select('*')
        .order('createdAt', { ascending: false });
    return data || [];
}

export async function deleteNewsletter(id: string) {
    await supabase.from('Newsletter' as any).delete().eq('id', id);
}
