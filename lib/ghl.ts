const GHL_API_VERSION = "2021-07-28"
const GHL_BASE_URL = "https://services.leadconnectorhq.com"

function getAuthHeaders() {
  const accessToken = process.env.GHL_ACCESS_TOKEN
  const locationId = process.env.GHL_LOCATION_ID

  if (!accessToken || !locationId) {
    throw new Error("Missing GHL configuration")
  }

  return {
    locationId,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }
}

interface QuoteProduct {
  name: string
  quantity: number
}

export interface QuoteRequestData {
  name: string
  companyName: string
  email: string
  phone: string
  message?: string
  products: QuoteProduct[]
}

export async function syncQuoteRequestToGHL(data: QuoteRequestData): Promise<void> {
  const { locationId, headers } = getAuthHeaders()

  const contactProductFieldId = process.env.GHL_FIELD_ID_PRODUCTS
  const oppProductFieldId = process.env.GHL_OPP_FIELD_ID_PRODUCTS
  const oppOrderLineItemsId = process.env.GHL_OPP_FIELD_ID_ORDER_LINE_ITEMS
  const oppQuoteMessageId = process.env.GHL_OPP_FIELD_ID_QUOTE_MESSAGE

  const productNames = data.products.map((p) => p.name.replace(/\s+/g, " ").trim())
  const orderLineItemsString = data.products
    .map((p) => `${p.name.replace(/\s+/g, " ").trim()} - ${p.quantity} pkts`)
    .join(", \n")

  const contactCustomFields = []
  if (contactProductFieldId) {
    contactCustomFields.push({ id: contactProductFieldId, value: productNames })
  }

  const contactPayload: any = {
    locationId,
    firstName: data.name.split(" ")[0],
    lastName: data.name.split(" ").slice(1).join(" ") || "",
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    source: "Biogex Website (Quote Page)",
    tags: ["web-quote-request"],
    createNewIfDuplicateAllowed: false,
    customFields: contactCustomFields,
  }

  const upsertResponse = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify(contactPayload),
  })

  if (!upsertResponse.ok) {
    throw new Error(`GHL Contact Upsert Failed: ${await upsertResponse.text()}`)
  }

  const contactData = await upsertResponse.json()
  const contactId: string | null = contactData.contact?.id || contactData.id

  if (!contactId) return

  const timestamp = new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })

  const oppCustomFields = []
  if (oppProductFieldId) {
    oppCustomFields.push({ id: oppProductFieldId, field_value: productNames })
  }
  if (oppOrderLineItemsId) {
    oppCustomFields.push({ id: oppOrderLineItemsId, field_value: orderLineItemsString })
  }
  if (oppQuoteMessageId) {
    oppCustomFields.push({ id: oppQuoteMessageId, field_value: data.message || "" })
  }

  const opportunityPayload = {
    locationId,
    contactId,
    pipelineId: process.env.GHL_PIPELINE_ID,
    pipelineStageId: process.env.GHL_STAGE_ID,
    name: `${data.name} - ${timestamp}`,
    status: "open",
    customFields: oppCustomFields,
  }

  const oppResponse = await fetch(`${GHL_BASE_URL}/opportunities/`, {
    method: "POST",
    headers,
    body: JSON.stringify(opportunityPayload),
  })

  if (!oppResponse.ok) {
    throw new Error(`GHL Opportunity Creation Failed: ${await oppResponse.text()}`)
  }
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function syncContactFormToGHL(data: ContactFormData): Promise<void> {
  const { locationId, headers } = getAuthHeaders()

  const contactPayload = {
    locationId,
    firstName: data.name.split(" ")[0],
    lastName: data.name.split(" ").slice(1).join(" ") || "",
    email: data.email,
    phone: data.phone,
    source: "Biogex Website (Contact Form)",
    tags: ["web-contact-form"],
    createNewIfDuplicateAllowed: false,
  }

  const upsertResponse = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify(contactPayload),
  })

  if (!upsertResponse.ok) {
    throw new Error(`GHL Contact Upsert Failed: ${await upsertResponse.text()}`)
  }

  const contactData = await upsertResponse.json()
  const contactId: string | null = contactData.contact?.id || contactData.id

  if (!contactId) return

  await fetch(`${GHL_BASE_URL}/contacts/${contactId}/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      body: `Subject: ${data.subject}\n\nMessage:\n${data.message}`,
    }),
  })
}
