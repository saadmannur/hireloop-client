import { serverFetch } from "../core/server"

export const getPlanById = async (PlanId) => {
    return serverFetch(`/api/plans?plan_id=${PlanId}`)
}