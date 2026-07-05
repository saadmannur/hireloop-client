import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const PLAN_PRICE_ID = {
    'seeker_pro': 'price_1TpiveBckGH0WkJmXd8BQgEz',
    'seeker_premium': 'price_1TpjVCBckGH0WkJm23VyzLNW',
    'recruiter_growth': 'price_1TpjWbBckGH0WkJmpHPFpUWZ',
    'recruiter_enterprise': 'price_1TpjXvBckGH0WkJm1lze0jXA',
} 