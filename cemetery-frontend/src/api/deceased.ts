import api from './axios'

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export type DeceasedPerson = {
    id: number
    firstName: string
    lastName: string
    dateOfBirth?: string
    dateOfDeath?: string
    gender?: Gender
}

export type DeceasedDetail = {
    id: number
    firstName: string
    lastName: string
    dateOfBirth?: string
    dateOfDeath?: string
    gender?: Gender
    burialDate?: string
    gravePlot?: {
        id: number
        section?: string
        plotNumber?: string
        locationDescription?: string
    } | null
}

/** Re-used by search & UI */
export type SearchValues = {
    firstName: string
    lastName: string
    dateOfBirth: string // ISO yyyy-mm-dd
}

/** Helper so the public search always returns an array */
function normalizeArray<T>(data: T | T[] | null | undefined): T[] {
    return Array.isArray(data) ? data : data ? [data] : []
}

/** ---------- PUBLIC ---------- */

/** Your existing strict search (kept) */
export async function strictSearch(params: SearchValues): Promise<DeceasedPerson[]> {
    const res = await api.get<DeceasedPerson[] | DeceasedPerson>(
        '/api/public/deceased-persons/search',
        { params }
    )
    return normalizeArray(res.data)
}

/** Alias with the name the screens import */
export async function searchPublicDeceased(params: SearchValues): Promise<DeceasedPerson[]> {
    return strictSearch(params)
}

export async function getDeceasedDetail(id: number): Promise<DeceasedDetail> {
    const { data } = await api.get<DeceasedDetail>(`/api/public/deceased-persons/${id}/detail`)
    return data
}

/** Alias with the name the detail page imports */
export async function getDeceasedById(id: number): Promise<DeceasedDetail> {
    return getDeceasedDetail(id)
}

/** ---------- ADMIN ---------- */

export type UpdatePersonRequest = Partial<
    Pick<DeceasedPerson, 'firstName' | 'lastName' | 'dateOfBirth' | 'dateOfDeath' | 'gender'>
>

export async function adminSearchPeople(q: string): Promise<DeceasedPerson[]> {
    const { data } = await api.get<DeceasedPerson[]>('/api/admin/deceased-persons', { params: { q } })
    return data
}

export async function adminUpdatePerson(
    id: number,
    payload: UpdatePersonRequest
): Promise<DeceasedPerson> {
    const { data } = await api.patch<DeceasedPerson>(`/api/admin/deceased-persons/${id}`, payload)
    return data
}

export async function adminDeletePerson(id: number): Promise<void> {
    await api.delete(`/api/admin/deceased-persons/${id}`)
}
