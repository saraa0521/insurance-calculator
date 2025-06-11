import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [monthlyPayment, setMonthlyPayment] = useState(500000);
  const [paymentPeriod, setPaymentPeriod] = useState(10);
  const [currentAge, setCurrentAge] = useState(35);
  const [withdrawalAge, setWithdrawalAge] = useState(65);
  const [selectedPlan, setSelectedPlan] = useState('return');
  const [results, setResults] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateResults = () => {
    if (monthlyPayment === 0) return;

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
    setIsCalculated(true);
  };

  const handleCalculate = () => {
    calculateResults();
  };

  return (
    <>
      <Head>
        <title>스마트 보험 인출 전략 계산기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Pretendard', sans-serif;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            min-height: 100vh;
          }
          
          .main-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 2rem 1rem;
            width: 100%;
          }
          
          .content-wrapper {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
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
          
          .cards-container {
            display: flex;
            justify-content: center;
            margin-bottom: 3rem;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            width: 100%;
            max-width: 900px;
          }
          
          .card {
            padding: 1.5rem;
            border-radius: 1rem;
            color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            backdrop-filter: blur(10px);
            border: 2px solid transparent;
          }
          
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          }
          
          .card.selected {
            border: 2px solid #ffd700;
            transform: translateY(-3px);
          }
          
          .card-return {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          }
          
          .card-pension {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .card-safe {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          
          .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .card-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .card-text {
            font-size: 0.9rem;
            margin-bottom: 1rem;
            opacity: 0.9;
          }
          
          .card-highlight {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.8rem;
            border-radius: 0.5rem;
            font-weight: 500;
            font-size: 0.85rem;
          }
          
          .calculator-container {
            display: flex;
            justify-content: center;
          }
          
          .calculator {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 100%;
            max-width: 800px;
          }
          
          .calculator-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .calculator-title {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .calculator-description {
            color: #718096;
            font-size: 1rem;
          }
          
          .input-section {
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
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .input-wrapper {
            position: relative;
          }
          
          .input {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.2s ease;
            background: white;
          }
          
          .input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          }
          
          .input-unit {
            position: absolute;
            right: 0.8rem;
            top: 0.8rem;
            color: #718096;
            font-weight: 500;
          }
          
          .calculate-button {
            width: 100%;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            border-radius: 0.8rem;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 2rem;
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
          }
          
          .calculate-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 172, 254, 0.6);
          }
          
          .calculate-button:active {
            transform: translateY(0);
          }
          
          .results-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-top: 2rem;
            opacity: ${isCalculated ? '1' : '0'};
            transform: ${isCalculated ? 'translateY(0)' : 'translateY(20px)'};
            transition: all 0.5s ease;
          }
          
          .results-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          
          .result-item {
            background: white;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 0.8rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .result-label {
            color: #4a5568;
            font-weight: 500;
          }
          
          .result-value {
            font-weight: 700;
            font-size: 1.1rem;
          }
          
          .result-total { color: #2d3748; }
          .result-green { color: #38a169; }
          .result-blue { color: #3182ce; }
          .result-purple { color: #805ad5; }
          
          .result-highlight {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
          }
          
          .result-highlight .result-label {
            color: rgba(255, 255, 255, 0.9);
          }
          
          .info-section {
            margin-top: 2rem;
            text-align: center;
          }
          
          .info-box {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .info-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1rem;
          }
          
          .info-text {
            font-size: 1rem;
            color: #4a5568;
            line-height: 1.5;
          }
          
          @media (max-width: 768px) {
            .title { font-size: 2rem; }
            .cards-grid { grid-template-columns: 1fr; }
            .input-section { grid-template-columns: 1fr; }
            .calculator { padding: 1.5rem; }
          }
        `}</style>
      </Head>

      <div className="main-container">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">
              🎯 스마트 보험 인출 전략 계산기
            </h1>
            <p className="subtitle">
              미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요
            </p>
            <p className="description">
              지금 가입하면 평생 걱정 없는 노후가 시작됩니다! ✨
            </p>
          </div>

          <div className="cards-container">
            <div className="cards-grid">
              <div 
                className={`card card-return ${selectedPlan === 'return' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('return')}
              >
                <div className="card-icon">📈</div>
                <h3 className="card-title">연 6.5% 수익률</h3>
                <p className="card-text">35년 장기 복리 효과 극대화</p>
                <div className="card-highlight">
                  <p>💎 프리미엄 수익률로 안전한 노후 보장!</p>
                </div>
              </div>

              <div 
                className={`card card-pension ${selectedPlan === 'pension' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('pension')}
              >
                <div className="card-icon">💰</div>
                <h3 className="card-title">평생 연금</h3>
                <p className="card-text">100세까지 안정적인 현금흐름</p>
                <div className="card-highlight">
                  <p>🛡️ 평생 보장되는 안정적인 수입원!</p>
                </div>
              </div>

              <div 
                className={`card card-safe ${selectedPlan === 'safe' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('safe')}
              >
                <div className="card-icon">🛡️</div>
                <h3 className="card-title">안전한 투자</h3>
                <p className="card-text">글로벌 보험사의 안전성</p>
                <div className="card-highlight">
                  <p>🏆 글로벌 보험사의 검증된 안전성!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="calculator-container">
            <div className="calculator">
              <div className="calculator-header">
                <h2 className="calculator-title">💰 인출 전략 계산기</h2>
                <p className="calculator-description">정보를 입력하고 계산 버튼을 눌러보세요</p>
              </div>

              <div className="input-section">
                <div className="input-group">
                  <label className="label">💵 월 납입금액</label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                      className="input"
                      placeholder="예: 500,000"
                    />
                    <span className="input-unit">원</span>
                  </div>
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

              <button 
                onClick={handleCalculate}
                className="calculate-button"
              >
                🚀 노후 계획 계산하기
              </button>

              {isCalculated && (
                <div className="results-section">
                  <h3 className="results-title">📊 예상 결과</h3>
                  
                  <div className="result-item">
                    <span className="result-label">총 납입금액</span>
                    <span className="result-value result-total">{formatNumber(results.totalPayment || 0)}원</span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">65세 예상 적립금</span>
                    <span className="result-value result-green">{formatNumber(results.accumulated65 || 0)}원</span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">월 인출 가능금액</span>
                    <span className="result-value result-blue">{formatNumber(results.monthlyWithdrawal || 0)}원</span>
                  </div>

                  <div className="result-item">
                    <span className="result-label">100세까지 총 수령액</span>
                    <span className="result-value result-purple">{formatNumber(results.totalReceived || 0)}원</span>
                  </div>

                  <div className="result-item result-highlight">
                    <span className="result-label">🚀 총 수익률</span>
                    <span className="result-value">{(results.returnRate || 0).toFixed(1)}%</span>
                  </div>
                </div>
              )}

              <div className="info-section">
                <div className="info-box">
                  <h3 className="info-title">💎 프리미엄 노후 설계 플랜</h3>
                  <p className="info-text">
                    시간과 복리의 마법을 활용하여 작은 돈을 큰 자산으로 만드는 
                    전문가 설계 전략입니다. 지금 시작하는 투자가 미래의 든든한 보장이 됩니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
