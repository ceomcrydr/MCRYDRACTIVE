'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/* ── PROFILE ──────────────────────────────────────────────── */

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const full_name = formData.get('full_name') as string
    const phone     = formData.get('phone')     as string
    const country   = formData.get('country')   as string

    const { error } = await supabase.from('profiles')
      .update({ full_name, phone, country })
      .eq('id', user.id)

    if (error) return { error: error.message }

    // Keep auth metadata in sync
    await supabase.auth.updateUser({ data: { full_name, phone, country } })

    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function addBike(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('bikes').insert({
      user_id:  user.id,
      brand:    formData.get('brand')    as string,
      model:    formData.get('model')    as string,
      year:     formData.get('year')     ? parseInt(formData.get('year') as string) : null,
      color:    formData.get('color')    as string || null,
      nickname: formData.get('nickname') as string || null,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function removeBike(bikeId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('bikes')
      .delete()
      .eq('id', bikeId)
      .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function updateBike(bikeId: string, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('bikes')
      .update({
        brand:    formData.get('brand')    as string,
        model:    formData.get('model')    as string,
        year:     formData.get('year')     ? parseInt(formData.get('year') as string) : null,
        color:    formData.get('color')    as string || null,
        nickname: formData.get('nickname') as string || null,
      })
      .eq('id', bikeId)
      .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── MARKETPLACE ──────────────────────────────────────────── */

export async function createMarketplaceListing(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('marketplace').insert({
      seller_id:   user.id,
      brand:       formData.get('brand')       as string,
      model:       formData.get('model')       as string,
      year:        formData.get('year')        ? parseInt(formData.get('year') as string)    : null,
      price:       formData.get('price')       ? parseFloat(formData.get('price') as string) : null,
      location:    formData.get('location')    as string,
      mileage:     formData.get('mileage')     ? parseInt(formData.get('mileage') as string) : null,
      color:       formData.get('color')       as string,
      description: formData.get('description') as string,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function deleteMarketplaceListing(id: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('marketplace')
      .update({ status: 'removed' })
      .eq('id', id)
      .eq('seller_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── EVENTS ───────────────────────────────────────────────── */

export async function createEvent(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('events').insert({
      creator_id:  user.id,
      title:       formData.get('title')       as string,
      type:        formData.get('type')        as string,
      date:        formData.get('date')        as string,
      location:    formData.get('location')    as string,
      max_riders:  formData.get('max_riders')  ? parseInt(formData.get('max_riders') as string) : null,
      description: formData.get('description') as string,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function joinEvent(eventId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('event_attendees').upsert({
      event_id: eventId,
      user_id:  user.id,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function leaveEvent(eventId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── GARAGES (Commercial) ─────────────────────────────────── */

export async function createGarage(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('garages').insert({
      owner_id:    user.id,
      name:        formData.get('name')        as string,
      type:        formData.get('type')        as string,
      location:    formData.get('location')    as string,
      phone:       formData.get('phone')       as string,
      description: formData.get('description') as string,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── RIDES ────────────────────────────────────────────────── */

export async function createRide(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const name       = (formData.get('name') as string) || 'Unnamed Ride'
    const visibility = (formData.get('visibility') as string) || 'public'
    const date       = formData.get('date') as string

    const { data: ride, error: rideErr } = await supabase.from('rides').insert({
      creator_id:           user.id,
      name,
      gathering_point_name: formData.get('gathering_point_name') as string,
      gathering_point_link: formData.get('gathering_point_link') as string,
      destination_name:     formData.get('destination_name')     as string,
      destination_link:     formData.get('destination_link')     as string,
      date:                 date || null,
      visibility,
    }).select().single()

    if (rideErr) return { error: rideErr.message }

    // Save stops
    const stopsJson = formData.get('stops') as string
    if (stopsJson) {
      const stops: string[] = JSON.parse(stopsJson)
      const valid = stops.filter(s => s.trim())
      if (valid.length > 0) {
        await supabase.from('ride_stops').insert(
          valid.map((s, i) => ({ ride_id: ride.id, name: s, order_num: i + 1 }))
        )
      }
    }

    // Add to events calendar if public + has date
    if (visibility === 'public' && date) {
      await supabase.from('events').insert({
        creator_id:  user.id,
        title:       name,
        type:        'Group Ride',
        date,
        location:    formData.get('gathering_point_name') as string,
        description: `From: ${formData.get('gathering_point_name') || '—'} · To: ${formData.get('destination_name') || '—'}`,
      })
    }

    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── POSTS ────────────────────────────────────────────────── */

export async function createPost(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('posts').insert({
      author_id:  user.id,
      content:    formData.get('content')   as string,
      post_type:  (formData.get('post_type') as string) || 'post',
      media_url:  (formData.get('media_url') as string) || null,
      media_type: (formData.get('media_type') as string) || 'none',
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

export async function toggleLike(postId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: existing } = await supabase.from('post_likes')
      .select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle()

    if (existing) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── FOLLOWS ──────────────────────────────────────────────── */

export async function followUser(targetId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('follows').upsert({ follower_id: user.id, following_id: targetId })
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

export async function unfollowUser(targetId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId)
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

/* ── TEAMS ────────────────────────────────────────────────── */

export async function createTeam(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: team, error: teamErr } = await supabase.from('teams').insert({
      creator_id: user.id,
      name:       formData.get('name')     as string,
      location:   formData.get('location') as string,
      about:      formData.get('about')    as string,
    }).select().single()

    if (teamErr) return { error: teamErr.message }

    // Creator is automatically the leader
    await supabase.from('team_members').insert({ team_id: team.id, user_id: user.id, role: 'leader' })

    // Add any extra members
    const membersJson = formData.get('members') as string
    if (membersJson) {
      const memberIds: string[] = JSON.parse(membersJson)
      if (memberIds.length > 0) {
        await supabase.from('team_members').insert(
          memberIds.map(id => ({ team_id: team.id, user_id: id, role: 'member' }))
        )
      }
    }

    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── TEAM FOLLOWS & JOIN REQUESTS ────────────────────────── */

export async function followTeam(teamId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('team_follows').upsert({ user_id: user.id, team_id: teamId })
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

export async function unfollowTeam(teamId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('team_follows').delete().eq('user_id', user.id).eq('team_id', teamId)
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

export async function requestJoinTeam(teamId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('team_join_requests').upsert({ team_id: teamId, user_id: user.id, status: 'pending' })
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

export async function cancelJoinRequest(teamId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    await supabase.from('team_join_requests').delete().eq('team_id', teamId).eq('user_id', user.id)
    return { success: true }
  } catch { return { error: 'Something went wrong.' } }
}

/* ── PRODUCTS / ACCESSORIES (Commercial) ─────────────────── */

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('products').insert({
      seller_id:   user.id,
      name:        formData.get('name')        as string,
      category:    formData.get('category')    as string,
      price:       formData.get('price')       ? parseFloat(formData.get('price') as string) : null,
      description: formData.get('description') as string,
      condition:   formData.get('condition')   as string,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── BUSINESS PROFILE ─────────────────────────────────────── */

export async function saveBusinessProfile(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const profileData = {
      owner_id:    user.id,
      name:        formData.get('name')        as string,
      type:        formData.get('type')        as string,
      location:    (formData.get('location')    as string) || null,
      phone:       (formData.get('phone')       as string) || null,
      description: (formData.get('description') as string) || null,
    }

    const { data: existing } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle()

    let error
    if (existing) {
      ;({ error } = await supabase.from('garages').update(profileData).eq('id', existing.id))
    } else {
      ;({ error } = await supabase.from('garages').insert(profileData))
    }

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── COMMERCIAL LISTINGS ──────────────────────────────────── */

export async function createListing(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('products').insert({
      seller_id:    user.id,
      name:         formData.get('name')          as string,
      category:     (formData.get('category')     as string) || null,
      price:        formData.get('price')         ? parseFloat(formData.get('price') as string) : null,
      description:  (formData.get('description')  as string) || null,
      condition:    (formData.get('condition')    as string) || null,
      listing_type: (formData.get('listing_type') as string) || 'product',
      image_url:    (formData.get('image_url')    as string) || null,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}

/* ── PROMOTIONS ───────────────────────────────────────────── */

export async function createPromotion(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('promotions').insert({
      seller_id:      user.id,
      title:          formData.get('title')           as string,
      description:    (formData.get('description')    as string) || null,
      discount_type:  (formData.get('discount_type')  as string) || null,
      discount_value: formData.get('discount_value')  ? parseFloat(formData.get('discount_value') as string) : null,
      valid_from:     (formData.get('valid_from')     as string) || null,
      valid_until:    (formData.get('valid_until')    as string) || null,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Something went wrong.' }
  }
}
