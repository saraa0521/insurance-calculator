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

    // 총 납입금액
    const totalPayment = monthlyPayment * 12 * paymentPeriod;

    // 연 수익률 (선택된 플랜에 따라)
    let annualRate = 0.065; // 6.5%
    if (selectedPlan === 'pension') annualRate = 0.055; // 5.5%
    if (selectedPlan === 'safe') annualRate = 0.045; // 4.5%

    // 납입 완료 후 추가 적립 기간
    const additionalYears = withdrawalAge - currentAge - paymentPeriod;

    // 납입 기간 동안의 적립금 (월복리)
    const monthlyRate = annualRate / 12;
    const paymentMonths = paymentPeriod * 12;
    let accumulated = 0;
    
    for (let i = 0; i < paymentMonths; i++) {
      accumulated = (accumulated + monthlyPayment) * (1 + monthlyRate);
    }

    // 추가 적립 기간 (납입 완료 후)
    if (additionalYears > 0) {
      accumulated = accumulated * Math.pow(1 + annualRate, additionalYears);
    }

    // 65세 시점 적립금
    const accumulated65 = accumulated;

    // 35년간 인출 (65세~100세)
    const withdrawalYears = 35;
    const monthlyWithdrawal = (accumulated65 * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -withdrawalYears * 12));

    // 총 수령액
    const totalReceived = monthlyWithdrawal * withdrawalYears * 12;

    // 수익률
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
            background: linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 50%, #fef7ed 100%);
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
            font-size: 3rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 1rem;
          }
          
          .subtitle {
            font-size: 1.25rem;
            color: #4b5563;
            margin-bottom: 0.5rem;
          }
          
          .description {
            font-size: 1.125rem;
            color: #6b7280;
          }
          
          .cards-container {
            display: flex;
            justify-content: center;
            margin-bottom: 3rem;
          }
          
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            width: 100%;
            max-width: 1000px;
          }
          
          .card {
            padding: 2rem;
            border-radius: 1rem;
            color: white;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            transition: transform 0.3s ease;
            position: relative;
          }
          
          .card:hover {
            transform: scale(1.05);
          }
          
          .card.selected {
            ring: 4px;
            ring-color: #fbbf24;
          }
          
          .card-return {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }
          
          .card-pension {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          }
          
          .card-safe {
            background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
          }
          
          .card-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          
          .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          
          .card-text {
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
          }
          
          .card-highlight {
            background: rgba(255, 255, 255, 0.2);
            padding: 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
          }
          
          .calculator-container {
            display: flex;
            justify-content: center;
          }
          
          .calculator {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
            color: #1f2937;
            margin-bottom: 1rem;
          }
          
          .calculator-description {
            color: #6b7280;
          }
          
          .input-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
          }
          
          .input-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
          }
          
          .label {
            font-size: 1.125rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          
          .input-wrapper {
            position: relative;
          }
          
          .input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            transition: border-color 0.2s;
          }
          
          .input:focus {
            outline: none;
            border-color: #3b82f6;
          }
          
          .input-unit {
            position: absolute;
            right: 0.75rem;
            top: 0.75rem;
            color: #6b7280;
          }
          
          .results-section {
            background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);
            border-radius: 0.75rem;
            padding: 1.5rem;
          }
          
          .results-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          
          .result-item {
            background: white;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .result-label {
            color: #6b7280;
          }
          
          .result-value {
            font-weight: 700;
            font-size: 1.125rem;
          }
          
          .result-total {
            color: #374151;
          }
          
          .result-green {
            color: #059669;
          }
          
          .result-blue {
            color: #2563eb;
          }
          
          .result-purple {
            color: #7c3aed;
          }
          
          .result-highlight {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          
          .result-highlight .result-label {
            color: white;
          }
          
          .bottom-section {
            margin-top: 3rem;
            text-align: center;
          }
          
          .info-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border-radius: 0.75rem;
            padding: 1.5rem;
          }
          
          .info-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }
          
          .info-text {
            font-size: 1.125rem;
            color: #374151;
            margin-bottom: 1rem;
          }
          
          .info-small {
            font-size: 1rem;
            color: #6b7280;
          }
          
          @media (max-width: 768px) {
            .title {
              font-size: 2rem;
            }
            
            .cards-grid {
              grid-template-columns: 1fr;
            }
            
            .input-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </Head>

      <div className="main-container">
        <div className="content-wrapper">
          <div className="header">
            <h1 className="title">
              스마트 보험 인출 전략 계산기
            </h1>
            <p className="subtitle">
              🎯 미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요
            </p>
            <p className="description">
              지금 가입하면 평생 걱정 없는 노후가 시작됩니다! ✨
            </p>
          </div>

          {/* 메인 카드들 */}
          <div className="cards-container">
            <div className="cards-grid">
              {/* 연 6.5% 수익률 카드 */}
              <div 
                className={`card card-return ${selectedPlan === 'return' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('return')}
              >
                <div className="card-icon">📈</div>
                <h3 className="card-title">연 6.5% 수익률</h3>
                <p className="card-text">35년 장기 복리 효과 극대화</p>
                <div className="card-highlight">
                  <p>지금 가입하면 평생 걱정 없는 노후가 시작됩니다!</p>
                </div>
              </div>

              {/* 평생 연금 카드 */}
              <div 
                className={`card card-pension ${selectedPlan === 'pension' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('pension')}
              >
                <div className="card-icon">💰</div>
                <h3 className="card-title">평생 연금</h3>
                <p className="card-text">100세까지 안정적인 현금흐름</p>
                <div className="card-highlight">
                  <p>해약 장기 저축 핵심은 노후가 시작됩니다!</p>
                </div>
              </div>

              {/* 안전한 투자 카드 */}
              <div 
                className={`card card-safe ${selectedPlan === 'safe' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('safe')}
              >
                <div className="card-icon">🛡️</div>
                <h3 className="card-title">안전한 투자</h3>
                <p className="card-text">글로벌 보험사의 안전성</p>
                <div className="card-highlight">
                  <p>지금 가입하면 평생 걱정 없는 노후가 시작됩니다!</p>
                </div>
              </div>
            </div>
          </div>

          {/* 계산 결과 */}
          <div className="calculator-container">
            <div className="calculator">
              <div className="calculator-header">
                <h2 className="calculator-title">💰 인출 전략 계산기</h2>
                <p className="calculator-description">간단한 정보 입력으로 맞춤형 노후 계획을 세워보세요</p>
              </div>

              <div className="input-grid">
                {/* 입력 섹션 */}
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

                {/* 결과 섹션 */}
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
                    <span className="result-label">총 수익률</span>
                    <span className="result-value">{(results.returnRate || 0).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="bottom-section">
                <div className="info-box">
                  <h3 className="info-title">🎯 해당 장기 저축 플랜은 단순한 저축이 아닙니다.</h3>
                  <p className="info-text">
                    지금 돈을 시간과 '복리'의 힘을 활용하여, 
                    간단한 인원의 대비 미래 시황으로 실현시키는 구조적 플랜입니다!
                  </p>
                  <p className="info-small">
                    지금 납인의 돈들과 '복리', 
                    간단한 인원의 대비 미래 시황으로 정부지키는 구조적 플랜입니다.
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
