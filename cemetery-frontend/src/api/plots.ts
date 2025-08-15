import api from './axios'

export type GravePlot = {
    id: number
    locationDescription?: string
    section?: string
    plotNumber?: string
}

export type CreatePlotRequest = {
    locationDescription?: string
    section: string
    plotNumber: string
}

export async function listPlots(): Promise<GravePlot[]> {
    const { data } = await api.get<GravePlot[]>('/api/public/grave-plots')
    return data
}

export async function getPlot(id: number): Promise<GravePlot> {
    const { data } = await api.get<GravePlot>(`/api/public/grave-plots/${id}`)
    return data
}

export async function createPlot(payload: CreatePlotRequest): Promise<GravePlot> {
    const { data } = await api.post<GravePlot>('/api/admin/grave-plots', payload)
    return data
}

/** ---------- ADMIN ---------- */

export type UpdatePlotRequest = Partial<Pick<GravePlot, 'section' | 'plotNumber' | 'locationDescription'>>

export async function adminSearchPlots(params: { section?: string; plotNumber?: string }): Promise<GravePlot[]> {
    const { data } = await api.get<GravePlot[]>('/api/admin/grave-plots', { params })
    return data
}

export async function adminUpdatePlot(id: number, payload: UpdatePlotRequest): Promise<GravePlot> {
    const { data } = await api.patch<GravePlot>(`/api/admin/grave-plots/${id}`, payload)
    return data
}

export async function adminDeletePlot(id: number): Promise<void> {
    await api.delete(`/api/admin/grave-plots/${id}`)
}
