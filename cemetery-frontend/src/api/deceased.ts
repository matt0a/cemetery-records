import api from './axios'

export type DeceasedPerson = {
    id: number
    firstName: string
    lastName: string
    dateOfBirth?: string
    dateOfDeath?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export type DeceasedDetail = {
    id: number
    firstName: string
    lastName: string
    dateOfBirth?: string
    dateOfDeath?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
    burialDate?: string
    gravePlot?: {
        id: number
        section?: string
        plotNumber?: string
        locationDescription?: string
    } | null
}

/** ---------- PUBLIC ---------- */

export async function strictSearch(params: {
    firstName: string; lastName: string; dateOfBirth: string
}): Promise<DeceasedPerson[]> {
    const res = await api.get<DeceasedPerson[] | DeceasedPerson>('/api/public/deceased-persons/search', { params })
    const payload = res.data as any
    return Array.isArray(payload) ? payload : payload ? [payload] : []
}

export async function getDeceasedDetail(id: number): Promise<DeceasedDetail> {
    const { data } = await api.get<DeceasedDetail>(`/api/public/deceased-persons/${id}/detail`)
    return data
}

/** ---------- ADMIN ---------- */

export type UpdatePersonRequest = Partial<Pick<DeceasedPerson,
    'firstName' | 'lastName' | 'dateOfBirth' | 'dateOfDeath' | 'gender'
>>

export async function adminSearchPeople(q: string): Promise<DeceasedPerson[]> {
    const { data } = await api.get<DeceasedPerson[]>('/api/admin/deceased-persons', { params: { q } })
    return data
}

export async function adminUpdatePerson(id: number, payload: UpdatePersonRequest): Promise<DeceasedPerson> {
    const { data } = await api.patch<DeceasedPerson>(`/api/admin/deceased-persons/${id}`, payload)
    return data
}

export async function adminDeletePerson(id: number): Promise<void> {
    await api.delete(`/api/admin/deceased-persons/${id}`)
}
