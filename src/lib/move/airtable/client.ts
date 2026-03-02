export const postToAirtable = async (fieldsPayload: any) => {
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;

  if (!baseId || !tableName || !token) {
    throw new Error("Configuração do Airtable ausente (VITE_AIRTABLE_BASE_ID / VITE_AIRTABLE_TABLE_NAME / VITE_AIRTABLE_TOKEN). ");
  }

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const airtableBody = { records: [{ fields: fieldsPayload }] };

  const response = await fetch(airtableUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(airtableBody),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const msg = err?.error?.message || err?.message || `Falha ao salvar no Airtable (${response.status})`;
    throw new Error(msg);
  }
};
