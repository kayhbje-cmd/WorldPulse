export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'ok',
    service: 'WorldPulse Live News Wire',
    environment: 'production',
    timestamp: Date.now(),
  });
}
