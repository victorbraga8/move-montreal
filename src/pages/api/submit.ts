
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body

  await fetch(process.env.AIRTABLE_URL!, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        Startup: body.startupName,
        Stage: body.stage,
        Model: body.model,
        MaturityScore: body.maturityScore,
        AnalysisPrompt: body.prompt
      }
    })
  })

  res.status(200).json({ ok: true })
}
