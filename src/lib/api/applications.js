import { protectedFetch } from "../core/server"

export const getApplicationByApplicantId = async (applicantId) => {
    return protectedFetch(`/api/applications?applicantId=${applicantId}`)
}