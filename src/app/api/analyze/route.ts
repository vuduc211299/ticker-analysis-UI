import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    // Determine a dummy ticker based on the question, or use a default
    let ticker = 'AAPL';
    if (question && typeof question === 'string') {
      const text = question.toUpperCase();
      if (text.includes('MICROSOFT') || text.includes('MSFT')) ticker = 'MSFT';
      else if (text.includes('GOOGLE') || text.includes('GOOG')) ticker = 'GOOGL';
      else if (text.includes('AMAZON') || text.includes('AMZN')) ticker = 'AMZN';
      else if (text.includes('TESLA') || text.includes('TSLA')) ticker = 'TSLA';
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate dummy historical data for the chart
    const chartData = [];
    let basePrice = 150 + Math.random() * 100;
    for (let i = 0; i < 30; i++) {
      basePrice = basePrice + (Math.random() * 10 - 4.5);
      chartData.push({
        name: `Day ${i + 1}`,
        price: Number(basePrice.toFixed(2))
      });
    }

    const currentPrice = chartData[chartData.length - 1].price;
    const startPrice = chartData[0].price;
    const percentChange = (((currentPrice - startPrice) / startPrice) * 100).toFixed(2);

    // Dummy response data
    const dummyData = {
      ticker,
      analysis: `${ticker} is currently exhibiting strong bullish sentiment, driven by robust demand and positive sector tailwinds. Recent earnings exceeded expectations, contributing to the recent price action. The stock is holding key support levels.\n\nKey supports: $${(currentPrice * 0.95).toFixed(0)}, $${(currentPrice * 0.9).toFixed(0)}\nResistances: $${(currentPrice * 1.05).toFixed(0)}, $${(currentPrice * 1.1).toFixed(0)}\n\nRecommended: Hold/Accumulate.`,
      currentPrice: currentPrice.toFixed(2),
      percentChange,
      chartData,
      timestamp: new Date().toISOString(),
      originalQuestion: question,
    };

    return NextResponse.json(dummyData);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Failed to process the question' },
      { status: 500 }
    );
  }
}
