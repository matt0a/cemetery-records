import api from './axios'

export type PatchBurialRequest = { burialDate?: string; notes?: string }

export type BurialRecord = {
    id: number
    burialDate?: string
    notes?: string
    deceasedPersonId?: number
    gravePlotId?: number
}

export type CreateBurialBundleRequest = {
    firstName: string
    lastName: string
    dateOfBirth?: string
    dateOfDeath?: string
    gender: 'MALE' | 'FEMALE' | 'OTHER'
    gravePlotId?: number
    locationDescription?: string
    section?: string
    plotNumber?: string
    burialDate: string
    notes?: string
}

export type BurialBundleResponse = {
    deceasedPersonId: number
    gravePlotId: number
    burialRecordId: number
}

export async function listBurialRecords(): Promise<BurialRecord[]> {
    const { data } = await api.get<BurialRecord[]>('/api/public/burial-records')
    return data
}

export async function getBurialRecord(id: number): Promise<BurialRecord> {
    const { data } = await api.get<BurialRecord>(`/api/public/burial-records/${id}`)
    return data
}

export async function patchBurialRecord(id: number, payload: PatchBurialRequest): Promise<BurialRecord> {
    const { data } = await api.patch<BurialRecord>(`/api/admin/burial-records/${id}`, payload)
    return data
}

export async function createBurialBundle(payload: CreateBurialBundleRequest): Promise<BurialBundleResponse> {
    const { data } = await api.post<BurialBundleResponse>('/api/admin/burials', payload)
    return data
}

export async function deleteBurialRecord(id: number): Promise<void> {
    await api.delete(`/api/admin/burial-records/${id}`)
}
