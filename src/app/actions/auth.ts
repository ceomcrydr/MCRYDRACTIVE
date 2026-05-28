'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) return { error: error.message }
    const role = formData.get('role') as string
    redirect(role === 'commercial' ? '/commercial' : '/rider')
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          first_name: formData.get('first_name'),
          last_name: formData.get('last_name'),
          phone: formData.get('phone'),
          country: formData.get('country'),
          role: formData.get('role') || 'rider',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })
    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
