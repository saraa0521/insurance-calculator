import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [monthlyPayment, setMonthlyPayment] = useState(500000);
  const [paymentPeriod, setPaymentPeriod] = useState(10);
  const [currentAge, setCurrentAge] = useState(35);
  const [withdrawalAge, setWithdrawalAge] = useState(65);
  const [selectedPlan, setSelectedPlan] = useState('return');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateResults = () => {
    const totalPayment = monthlyPayment * 12 * paymentPeriod;

    let annualRate = 0.065;
    if (selectedPlan === 'pension') annualRate = 0.055;
    if (selectedPlan === 'safe') annualRate = 0.045;

    const additionalYears = withdrawalAge - currentAge - paymentPeriod;
    const monthlyRate = annualRate / 12;
    const paymentMonths = paymentPeriod * 12;
    let accumulated = 0;
    
    for (let i = 0; i < paymentMonths; i++) {
      accumulated = (accumulated + monthlyPayment) * (1 + monthlyRate);
    }

    if (additionalYears > 0) {
      accumulated = accumulated * Math.pow(1 + annualRate, additionalYears);
    }

    const accumulated65 = accumulated;
    const withdrawalYears = 35;
    const monthlyWithdrawal = (accumulated65 * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -withdrawalYears * 12));
    const totalReceived = monthlyWithdrawal * withdrawalYears * 12;
    const returnRate = ((totalReceived - totalPayment) / totalPayment * 100);

    setResults({
      totalPayment,
      accumulated65,
      monthlyWithdrawal,
      totalReceived,
      returnRate
    });
    setShowResults(true);
  };

  return (
    <>
      <Head>
        <title>스마트 보험 인출 전략 계산기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Pretendard', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 1rem;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
          }
          
          .main-content {
            max-width: 800px;
            width: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .title {
            font-size: 2.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .subtitle {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 0.5rem;
          }
          
          .description {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
          }
          
          .plan-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 3rem;
          }
          
          .plan-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .plan-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .plan-card.selected {
            border: 3px solid #ffd700;
          }
          
          .plan-card.green {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          
          .plan-card.purple {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
          }
          
          .plan-card.blue {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
          }
          
          .plan-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
          }
          
          .plan-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .plan-subtitle {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 1rem;
          }
          
          .plan-rate {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
          }
          
          .input-section {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
          
          .input-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1.5rem;
            text-align: center;
          }
          
          .input-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
          }
          
          .label {
            font-size: 1rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 0.5rem;
          }
          
          .input {
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.2s ease;
          }
          
          .input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .calculate-btn {
            width: 100%;
            padding: 1.2rem 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.3rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }
          
          .calculate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.6);
          }
          
          .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .result-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .result-card:hover {
            transform: translateY(-5px);
          }
          
          .result-card.highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .result-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .result-title {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            opacity: 0.8;
          }
          
          .result-value {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
          }
          
          .result-unit {
            font-size: 0.9rem;
            opacity: 0.7;
          }
          
          @media (max-width: 768px) {
            .title { font-size: 2rem; }
            .results-grid { grid-template-columns: 1fr; }
            .input-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </Head>

      <div className="container">
        <div className="main-content">
          <div className="header">
            <h1 className="title">🎯 스마트 보험 인출 전략 계산기</h1>
            <p className="subtitle">🎯 미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요</p>
            <p className="description">✨ 지금 가입하면 평생 걱정 없는 노후가 시작됩니다! ✨</p>
          </div>

          <div className="plan-cards">
            <div 
              className={`plan-card green ${selectedPlan === 'return' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('return')}
            >
              <span className="plan-icon">📈</span>
              <h3 className="plan-title">연 6.5% 수익률</h3>
              <p className="plan-subtitle">35년 장기 복리 효과 극대화</p>
              <div className="plan-rate">6.5%</div>
              <p>💎 프리미엄 수익률로 안전한 노후 보장!</p>
            </div>

            <div 
              className={`plan-card purple ${selectedPlan === 'pension' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('pension')}
            >
              <span className="plan-icon">💰</span>
              <h3 className="plan-title">평생 연금</h3>
              <p className="plan-subtitle">100세까지 안정적인 현금흐름</p>
              <div className="plan-rate">5.5%</div>
              <p>🛡️ 평생 보장되는 안정적인 수입원!</p>
            </div>

            <div 
              className={`plan-card blue ${selectedPlan === 'safe' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('safe')}
            >
              <span className="plan-icon">🛡️</span>
              <h3 className="plan-title">안전한 투자</h3>
              <p className="plan-subtitle">글로벌 보험사의 안전성</p>
              <div className="plan-rate">4.5%</div>
              <p>🏆 글로벌 보험사의 검증된 안전성!</p>
            </div>
          </div>

          <div className="input-section">
            <h2 className="input-title">💰 정보 입력으로 맞춤형 노후 계획을 세워보세요</h2>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="label">💵 월 납입금액</label>
                <input 
                  type="number" 
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                  className="input"
                  placeholder="예: 500,000"
                />
              </div>

              <div className="input-group">
                <label className="label">📅 납입 기간</label>
                <select 
                  value={paymentPeriod}
                  onChange={(e) => setPaymentPeriod(Number(e.target.value))}
                  className="input"
                >
                  <option value="10">10년</option>
                  <option value="15">15년</option>
                  <option value="20">20년</option>
                  <option value="25">25년</option>
                  <option value="30">30년</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">🎂 현재 나이</label>
                <input 
                  type="number" 
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="input"
                  placeholder="예: 35"
                />
              </div>

              <div className="input-group">
                <label className="label">🏖️ 인출 시작 나이</label>
                <input 
                  type="number" 
                  value={withdrawalAge}
                  onChange={(e) => setWithdrawalAge(Number(e.target.value))}
                  className="input"
                  placeholder="예: 65"
                />
              </div>
            </div>

            <button onClick={calculateResults} className="calculate-btn">
              🚀 노후 계획 계산하기
            </button>
          </div>

          {showResults && (
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon">💰</div>
                <div className="result-title">총 납입금액</div>
                <div className="result-value">{formatNumber(results.totalPayment || 0)}</div>
                <div className="result-unit">원</div>
              </div>

              <div className="result-card">
                <div className="result-icon">📈</div>
                <div className="result-title">65세 예상 적립금</div>
                <div className="result-value">{formatNumber(results.accumulated65 || 0)}</div>
                <div className="result-unit">원</div>
              </div>

              <div className="result-card">
                <div className="result-icon">💸</div>
                <div className="result-title">월 인출 가능금액</div>
                <div className="result-value">{formatNumber(results.monthlyWithdrawal || 0)}</div>
                <div className="result-unit">원</div>
              </div>

              <div className="result-card">
                <div className="result-icon">🎯</div>
                <div className="result-title">100세까지 총 수령액</div>
                <div className="result-value">{formatNumber(results.totalReceived || 0)}</div>
                <div className="result-unit">원</div>
              </div>

              <div className="result-card highlight">
                <div className="result-icon">🚀</div>
                <div className="result-title">총 수익률</div>
                <div className="result-value">{(results.returnRate || 0).toFixed(1)}%</div>
                <div className="result-unit">수익</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
