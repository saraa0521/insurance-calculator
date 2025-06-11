import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [monthlyPayment, setMonthlyPayment] = useState(500000);
  const [paymentPeriod, setPaymentPeriod] = useState(10);
  const [currentAge, setCurrentAge] = useState(35);
  const [withdrawalAge, setWithdrawalAge] = useState(65);
  const [selectedPlan, setSelectedPlan] = useState('return');
  const [results, setResults] = useState({});

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
  };

  useEffect(() => {
    calculateResults();
  }, [monthlyPayment, paymentPeriod, currentAge, withdrawalAge, selectedPlan]);

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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(79, 172, 254, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
            }
          }
          
          .main-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 3rem 1rem;
            width: 100%;
          }
          
          .content-wrapper {
            max-width: 1400px;
            width: 100%;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 4rem;
            animation: fadeInUp 1.2s ease-out;
          }
          
          .title {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: bounce 2s infinite;
          }
          
          .subtitle {
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .description {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.85);
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .cards-container {
            display: flex;
            justify-content: center;
            margin-bottom: 4rem;
            animation: slideInLeft 1.5s ease-out 0.3s both;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
            width: 100%;
            max-width: 1200px;
          }
          
          .card {
            padding: 2.5rem;
            border-radius: 2rem;
            color: white;
            box-shadow: 
              0 32px 64px -12px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(20px);
          }
          
          .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            z-index: 1;
          }
          
          .card > * {
            position: relative;
            z-index: 2;
          }
          
          .card:hover {
            transform: translateY(-15px) scale(1.05);
            box-shadow: 
              0 48px 96px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
          
          .card.selected {
            transform: translateY(-10px) scale(1.02);
            animation: pulse 2s infinite;
            border: 3px solid rgba(255, 215, 0, 0.8);
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
            font-size: 5rem;
            margin-bottom: 1.5rem;
            animation: bounce 2s infinite;
          }
          
          .card-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .card-text {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          }
          
          .card-highlight {
            background: rgba(255, 255, 255, 0.25);
            padding: 1.5rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 1.1rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .calculator-container {
            display: flex;
            justify-content: center;
            animation: slideInRight 1.5s ease-out 0.6s both;
          }
          
          .calculator {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 2rem;
            box-shadow: 
              0 32px 64px -12px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
            padding: 3rem;
            width: 100%;
            max-width: 1000px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .calculator-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .calculator-title {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
          }
          
          .calculator-description {
            color: #6b7280;
            font-size: 1.2rem;
          }
          
          .input-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
          }
          
          .input-section {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
          }
          
          .label {
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.75rem;
          }
          
          .input-wrapper {
            position: relative;
          }
          
          .input {
            width: 100%;
            padding: 1rem 1.5rem;
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 1rem;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
          }
          
          .input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
          }
          
          .input-unit {
            position: absolute;
            right: 1rem;
            top: 1rem;
            color: #667eea;
            font-weight: 600;
          }
          
          .results-section {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-radius: 1.5rem;
            padding: 2rem;
            border: 1px solid rgba(102, 126, 234, 0.2);
            backdrop-filter: blur(10px);
          }
          
          .results-title {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .result-item {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.2s ease;
          }
          
          .result-item:hover {
            transform: translateX(5px);
          }
          
          .result-label {
            color: #4b5563;
            font-weight: 600;
          }
          
          .result-value {
            font-weight: 800;
            font-size: 1.25rem;
          }
          
          .result-total { color: #374151; }
          .result-green { color: #059669; }
          .result-blue { color: #2563eb; }
          .result-purple { color: #7c3aed; }
          
          .result-highlight {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            animation: pulse 2s infinite;
          }
          
          .result-highlight .result-label {
            color: rgba(255, 255, 255, 0.9);
          }
          
          .bottom-section {
            margin-top: 4rem;
            text-align: center;
            animation: fadeInUp 1.5s ease-out 0.9s both;
          }
          
          .info-box {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
            backdrop-filter: blur(20px);
            border-radius: 1.5rem;
            padding: 2.5rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.1);
          }
          
          .info-title {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1.5rem;
          }
          
          .info-text {
            font-size: 1.2rem;
            color: #374151;
            margin-bottom: 1rem;
            line-height: 1.6;
          }
          
          .info-small {
            font-size: 1rem;
            color: #6b7280;
            line-height: 1.5;
          }
          
          @media (max-width: 768px) {
            .title { font-size: 2.5rem; }
            .cards-grid { grid-template-columns: 1fr; }
            .input-grid { grid-template-columns: 1fr; }
            .main-container { padding: 2rem 1rem; }
            .calculator { padding: 2rem; }
          }
        `}</style>
      </Head>

      <div className="main-container">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">
              ✨ 스마트 보험 인출 전략 계산기 ✨
            </h1>
            <p className="subtitle">
              🎯 미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요
            </p>
            <p className="description">
              지금 가입하면 평생 걱정 없는 노후가 시작됩니다! 🚀
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
                <h2 className="calculator-title">💰 프리미엄 인출 전략 계산기</h2>
                <p className="calculator-description">간단한 정보 입력으로 맞춤형 노후 계획을 세워보세요</p>
              </div>

              <div className="input-grid">
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
              </div>

              <div className="bottom-section">
                <div className="info-box">
                  <h3 className="info-title">🎯 이것은 단순한 저축이 아닙니다!</h3>
                  <p className="info-text">
                    💎 <strong>시간과 복리의 마법</strong>을 활용하여 작은 돈을 큰 자산으로 만드는 
                    <strong>프리미엄 노후 설계 플랜</strong>입니다!
                  </p>
                  <p className="info-small">
                    🏆 지금 시작하는 작은 투자가 미래의 든든한 보장이 됩니다. 
                    전문가가 설계한 검증된 전략으로 안전하고 확실한 노후를 준비하세요!
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
