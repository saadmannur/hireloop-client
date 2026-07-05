'use server'

import { serverMutation } from "../core/server"

export const createSubscription = async (subscriptionInfo) => {
    return serverMutation('/api/subscriptions', subscriptionInfo)
}