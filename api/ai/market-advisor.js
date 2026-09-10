import { handleCors } from '../_utils/http.js';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const VALID_RECOMMENDATIONS = new Set(['SELL', 'HOLD', 'CONSIDER_ALTERNATIVE', 'INSUFFICIENT_DATA']);
const VALID_CONFIDENCE = new Set(['LOW', 'MEDIUM', 'HIGH']);

function sendJson(res, status, payload) {
  return res.status(status).json(payload);
}

function isEvidenceItem(item) {
  return item &&
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    typeof item.label === 'string' &&
    item.value !== undefined &&
    typeof item.source === 'string';
}

function parseGeminiJson(text = '') {
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(trimmed);
}

function validateAssistantOutput(output, evidenceIds) {
  if (!output || typeof output !== 'object') throw new Error('Gemini response was not an object');
  if (!VALID_RECOMMENDATIONS.has(output.recommendation)) throw new Error('Invalid recommendation in Gemini response');
  if (!VALID_CONFIDENCE.has(output.confidence)) throw new Error('Invalid confidence in Gemini response');
  if (typeof output.summary !== 'string') throw new Error('Missing summary in Gemini response');
  if (!Array.isArray(output.reasons)) throw new Error('Missing reasons in Gemini response');
  if (typeof output.suggestedAction !== 'string') throw new Error('Missing suggestedAction in Gemini response');
  if (!Array.isArray(output.limitations)) throw new Error('Missing limitations in Gemini response');

  output.reasons.forEach((reason) => {
    if (!reason || typeof reason.text !== 'string' || !Array.isArray(reason.evidenceIds)) {
      throw new Error('Invalid reason in Gemini response');
    }
    if (reason.evidenceIds.length === 0) {
      throw new Error('Every reason must reference at least one evidence ID');
    }
    reason.evidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) throw new Error(`Gemini referenced unknown evidence ID: ${id}`);
    });
  });

  return {
    recommendation: output.recommendation,
    confidence: output.confidence,
    summary: output.summary,
    reasons: output.reasons.map(reason => ({
      text: reason.text,
      evidenceIds: reason.evidenceIds
    })),
    suggestedAction: output.suggestedAction,
    limitations: output.limitations.filter(item => typeof item === 'string')
  };
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendJson(res, 503, {
        success: false,
        message: 'Gemini API key is not configured.',
        code: 'GEMINI_UNAVAILABLE'
      });
    }

    const { context, evidence } = req.body || {};
    if (!context || typeof context !== 'object') {
      return sendJson(res, 400, { success: false, message: 'context is required' });
    }
    if (!Array.isArray(evidence) || evidence.length === 0 || !evidence.every(isEvidenceItem)) {
      return sendJson(res, 400, { success: false, message: 'Valid evidence array is required' });
    }

    const evidenceIds = new Set(evidence.map(item => item.id));
    const prompt = [
      'You are KhetSetu AI Market Assistant, an analytical helper for a multi-commodity market-intelligence platform.',
      'Use ONLY the supplied KhetSetu evidence. Do not invent prices, forecasts, buyers, quality data, certificates, news, market conditions, or sources.',
      'Do not recompute financial values. If the evidence is insufficient, say so explicitly.',
      'Every factual reason must cite one or more evidenceIds from the supplied evidence.',
      'Return ONLY valid JSON matching this schema:',
      '{"recommendation":"SELL|HOLD|CONSIDER_ALTERNATIVE|INSUFFICIENT_DATA","confidence":"LOW|MEDIUM|HIGH","summary":"string","reasons":[{"text":"string","evidenceIds":["string"]}],"suggestedAction":"string","limitations":["string"]}',
      '',
      `Context: ${JSON.stringify(context)}`,
      `Evidence: ${JSON.stringify(evidence)}`
    ].join('\n');

    const geminiResponse = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2
        }
      })
    });

    const geminiPayload = await geminiResponse.json().catch(() => null);
    if (!geminiResponse.ok) {
      return sendJson(res, 502, {
        success: false,
        message: geminiPayload?.error?.message || `Gemini API returned ${geminiResponse.status}`,
        code: 'GEMINI_UNAVAILABLE'
      });
    }

    const text = geminiPayload?.candidates?.[0]?.content?.parts?.map(part => part.text).join('') || '';
    if (!text) {
      return sendJson(res, 502, {
        success: false,
        message: 'Gemini returned an empty response.',
        code: 'GEMINI_EMPTY_RESPONSE'
      });
    }

    const parsed = parseGeminiJson(text);
    const data = validateAssistantOutput(parsed, evidenceIds);
    return sendJson(res, 200, { success: true, data, evidence });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      message: error.message || 'KhetSetu AI Market Assistant failed.'
    });
  }
}
