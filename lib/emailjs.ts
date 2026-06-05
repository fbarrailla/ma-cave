import emailjs from '@emailjs/browser'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

export async function sendSubscriptionConfirmation(userEmail: string) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      subject: 'Subscription confirmation',
      email: userEmail,
    },
    PUBLIC_KEY,
  )
}
