'use server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) return { error: error.message }

    // Read role from the stored profile (not the form) — source of truth
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role || (formData.get('role') as string) || 'rider'
    redirect(role === 'commercial' ? '/commercial' : '/rider')
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()

    const firstName = formData.get('first_name') as string
    const lastName  = formData.get('last_name')  as string
    const fullName  = `${firstName} ${lastName}`.trim()
    const role      = (formData.get('role') as string) || 'rider'

    const { data, error } = await supabase.auth.signUp({
      email:    formData.get('email')    as string,
      password: formData.get('password') as string,
      options: {
        data: {
          full_name: fullName,
          phone:     formData.get('phone'),
          country:   formData.get('country'),
          role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error)      return { error: error.message }
    if (!data.user) return { error: 'Signup failed. Please try again.' }

    // Save bikes immediately if a session exists (email confirmation disabled)
    const bikesJson = formData.get('bikes') as string
    if (bikesJson && data.session) {
      const bikes = JSON.parse(bikesJson) as Array<{
        brand: string; model: string; year: string; color: string; nickname: string
      }>
      const valid = bikes.filter(b => b.brand && b.model)
      if (valid.length > 0) {
        await supabase.from('bikes').insert(
          valid.map(b => ({
            user_id:  data.user!.id,
            brand:    b.brand,
            model:    b.model,
            year:     b.year ? parseInt(b.year) : null,
            color:    b.color    || null,
            nickname: b.nickname || null,
          }))
        )
      }
    }

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
