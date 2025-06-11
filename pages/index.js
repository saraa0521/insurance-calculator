import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [company, setCompany] = useState('Sun Life');
  const [product, setProduct] = useState('SunJoy Global - 2년납');
  const [paymentPeriod, setPaymentPeriod] = useState(2);
  const [annualPayment, setAnnualPayment] = useState(50000);
  const [subscriptionAge, setSubscriptionAge] = useState(35);
  const [withdrawalStartAge, setWithdrawalStartAge] = useState(65);
  const [withdrawalEndAge, setWithdrawalEndAge] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState('return');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});

  const formatNumber = (num) => {
    return '$' + Math.round(num).toLocaleString('en-US');
  };

  const handleCompanyChange = (newCompany) => {
    setCompany(newCompany);
    if (newCompany === 'Sun Life') {
      setProduct(`SunJoy Global - ${paymentPeriod}년납`);
    } else if (newCompany === 'Chubb') {
      setProduct(`CMLP - ${paymentPeriod}년납`);
    }
  };

  const handlePaymentPeriodChange = (period) => {
    setPaymentPeriod(period);
    if (company === 'Sun Life') {
      setProduct(`SunJoy Global - ${period}년납`);
    } else if (company === 'Chubb') {
      setProduct(`CMLP - ${period}년납`);
    }
  };

  const calculateResults = () => {
    const totalPayment = annualPayment * paymentPeriod;

    let annualRate = 0.065;
    if (selectedPlan === 'pension') annualRate = 0.055;
    if (selectedPlan === 'safe') annualRate = 0.045;

    // 납입 기간 동안의 적립금 (연복리)
    let accumulated = 0;
    for (let i = 0; i < paymentPeriod; i++) {
      accumulated = (accumulated + annualPayment) * (1 + annualRate);
    }

    // 가입 나이부터 인출 시작 나이까지의 기간 계산
    const waitingPeriod = withdrawalStartAge - subscriptionAge - paymentPeriod;
    if (waitingPeriod > 0) {
      accumulated = accumulated * Math.pow(1 + annualRate, waitingPeriod);
    }

    const accumulatedAtWithdrawal = accumulated;

    // 인출 기간 계산
    const withdrawalYears = withdrawalEndAge - withdrawalStartAge;
    
    // 연간 인출금액 계산 (연금 현가 공식)
    const annualWithdrawal = (accumulated * annualRate) / (1 - Math.pow(1 + annualRate, -withdrawalYears));
    
    // 총 인출금액
    const totalWithdrawn = annualWithdrawal * withdrawalYears;
    
    // 100세 해약환급금 (인출 후 남은 금액)
    let remainingAfterWithdrawal = accumulated;
    for (let i = 0; i < withdrawalYears; i++) {
      remainingAfterWithdrawal = (remainingAfterWithdrawal - annualWithdrawal) * (1 + annualRate);
    }
    const surrenderValue = Math.max(0, remainingAfterWithdrawal);
    
    // 총 수익 = 총 인출금액 + 해약환급금
    const totalBenefit = totalWithdrawn + surrenderValue;
    
    // 수익률
    const returnRate = ((totalBenefit - totalPayment) / totalPayment * 100);

    setResults({
      totalPayment,
      accumulatedAtWithdrawal,
      annualWithdrawal,
      totalWithdrawn,
      surrenderValue,
      totalBenefit,
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
          
          .input, .select {
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.2s ease;
          }
          
          .input:focus, .select:focus {
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
          
          .analysis-section {
            margin-top: 3rem;
          }
          
          .analysis-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .analysis-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 2rem;
            text-align: center;
          }
          
          .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          
          .analysis-item {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 15px;
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .analysis-icon {
            font-size: 2rem;
            margin-top: 0.5rem;
          }
          
          .analysis-content h4 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .analysis-content p {
            font-size: 0.9rem;
            color: #4a5568;
            margin-bottom: 0.3rem;
          }
          
          .analysis-content .highlight {
            font-weight: 600;
            color: #667eea;
            background: rgba(102, 126, 234, 0.1);
            padding: 0.3rem 0.6rem;
            border-radius: 8px;
            margin-top: 0.5rem;
            display: inline-block;
          }
          
          .recommendation-section {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .rec-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 2rem;
            text-align: center;
          }
          
          .rec-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }
          
          .rec-card {
            border-radius: 15px;
            padding: 1.5rem;
          }
          
          .rec-card.positive {
            background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
            border-left: 4px solid #38a169;
          }
          
          .rec-card.warning {
            background: linear-gradient(135deg, #fffaf0 0%, #fbd38d 100%);
            border-left: 4px solid #ed8936;
          }
          
          .rec-card.suggestion {
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            border-left: 4px solid #4299e1;
          }
          
          .rec-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .rec-card h4 {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1rem;
          }
          
          .rec-card ul {
            list-style: none;
            padding: 0;
          }
          
          .rec-card li {
            font-size: 0.95rem;
            color: #4a5568;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
          }
          
          .rec-card li::before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0.5rem;
          }
          
          .timeline-section {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          
          .timeline-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 2rem;
            text-align: center;
          }
          
          .timeline {
            position: relative;
            padding-left: 2rem;
          }
          
          .timeline::before {
            content: "";
            position: absolute;
            left: 1rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, #667eea, #764ba2);
          }
          
          .timeline-item {
            position: relative;
            margin-bottom: 2rem;
            padding-left: 2rem;
          }
          
          .timeline-dot {
            position: absolute;
            left: -2.5rem;
            top: 0.5rem;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
          }
          
          .timeline-dot.start {
            background: #48bb78;
          }
          
          .timeline-dot.middle {
            background: #4299e1;
          }
          
          .timeline-dot.end {
            background: #ed8936;
          }
          
          .timeline-content h4 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          @media (max-width: 768px) {
            .title { font-size: 2rem; }
            .results-grid { grid-template-columns: 1fr; }
            .input-grid { grid-template-columns: 1fr; }
            .analysis-grid { grid-template-columns: 1fr; }
            .rec-grid { grid-template-columns: 1fr; }
            .timeline { padding-left: 1rem; }
            .timeline-item { padding-left: 1.5rem; }
            .timeline-dot { left: -2rem; }
          }
        `}</style>
      </Head>

      <div className="container">
        <div className="main-content">
          <div className="header">
            <h1 className="title">🎯 해외 장기 저축 인출 전략 계산기</h1>
            <p className="subtitle">💰 가입 후 몇 년부터 인출하면 얼마의 연금을 받을 수 있을까요?</p>
            <p className="description">✨ 해외 장기 저축으로 복리의 힘을 활용한 완벽한 노후 준비! ✨</p>
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
              <p>💎 해외 장기 저축의 복리 효과!</p>
            </div>

            <div 
              className={`plan-card purple ${selectedPlan === 'pension' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('pension')}
            >
              <span className="plan-icon">💰</span>
              <h3 className="plan-title">평생 연금</h3>
              <p className="plan-subtitle">100세까지 안정적인 현금흐름</p>
              <div className="plan-rate">5.5%</div>
              <p>🛡️ 안정적인 해외 장기 저축!</p>
            </div>

            <div 
              className={`plan-card blue ${selectedPlan === 'safe' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('safe')}
            >
              <span className="plan-icon">🛡️</span>
              <h3 className="plan-title">안전한 투자</h3>
              <p className="plan-subtitle">글로벌 보험사의 안전성</p>
              <div className="plan-rate">4.5%</div>
              <p>🏆 글로벌 보험사의 해외 저축!</p>
            </div>
          </div>

          <div className="input-section">
            <h2 className="input-title">💰 정보 입력으로 맞춤형 노후 계획을 세워보세요</h2>
            
            <div className="input-grid">
              <div className="input-group">
                <label className="label">🏢 회사 선택</label>
                <select 
                  value={company}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="select"
                >
                  <option value="Sun Life">Sun Life</option>
                  <option value="Chubb">Chubb</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">📋 상품명</label>
                <input 
                  type="text" 
                  value={product}
                  readOnly
                  className="input"
                  style={{backgroundColor: '#f7fafc'}}
                />
              </div>

              <div className="input-group">
                <label className="label">📅 납입 기간</label>
                <select 
                  value={paymentPeriod}
                  onChange={(e) => handlePaymentPeriodChange(Number(e.target.value))}
                  className="select"
                >
                  <option value="2">2년납</option>
                  <option value="5">5년납</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">💵 연간 납입금액 (USD)</label>
                <input 
                  type="number" 
                  value={annualPayment}
                  onChange={(e) => setAnnualPayment(Number(e.target.value))}
                  className="input"
                  placeholder="예: 50,000"
                />
              </div>

              <div className="input-group">
                <label className="label">📝 가입 나이</label>
                <input 
                  type="number" 
                  value={subscriptionAge}
                  onChange={(e) => setSubscriptionAge(Number(e.target.value))}
                  className="input"
                  placeholder="예: 35"
                />
              </div>

              <div className="input-group">
                <label className="label">🏖️ 인출 시작 나이</label>
                <input 
                  type="number" 
                  value={withdrawalStartAge}
                  onChange={(e) => setWithdrawalStartAge(Number(e.target.value))}
                  className="input"
                  placeholder="예: 65"
                />
              </div>

              <div className="input-group">
                <label className="label">⏰ 인출 종료 나이</label>
                <input 
                  type="number" 
                  value={withdrawalEndAge}
                  onChange={(e) => setWithdrawalEndAge(Number(e.target.value))}
                  className="input"
                  placeholder="예: 100"
                />
              </div>
            </div>

            <button onClick={calculateResults} className="calculate-btn">
              🚀 노후 계획 계산하기
            </button>
          </div>

          {showResults && (
            <>
              <div className="results-grid">
                <div className="result-card">
                  <div className="result-icon">💰</div>
                  <div className="result-title">총 납입금액</div>
                  <div className="result-value">{formatNumber(results.totalPayment || 0)}</div>
                  <div className="result-unit">USD</div>
                </div>

                <div className="result-card">
                  <div className="result-icon">📈</div>
                  <div className="result-title">{withdrawalStartAge}세 적립금</div>
                  <div className="result-value">{formatNumber(results.accumulatedAtWithdrawal || 0)}</div>
                  <div className="result-unit">USD</div>
                </div>

                <div className="result-card">
                  <div className="result-icon">💸</div>
                  <div className="result-title">연간 인출금액</div>
                  <div className="result-value">{formatNumber(results.annualWithdrawal || 0)}</div>
                  <div className="result-unit">USD/년</div>
                </div>

                <div className="result-card">
                  <div className="result-icon">💵</div>
                  <div className="result-title">총 인출금액</div>
                  <div className="result-value">{formatNumber(results.totalWithdrawn || 0)}</div>
                  <div className="result-unit">USD</div>
                </div>

                <div className="result-card">
                  <div className="result-icon">🏦</div>
                  <div className="result-title">100세 해약환급금</div>
                  <div className="result-value">{formatNumber(results.surrenderValue || 0)}</div>
                  <div className="result-unit">USD</div>
                </div>

                <div className="result-card">
                  <div className="result-icon">💎</div>
                  <div className="result-title">총 수익</div>
                  <div className="result-value">{formatNumber(results.totalBenefit || 0)}</div>
                  <div className="result-unit">USD</div>
                </div>

                <div className="result-card highlight">
                  <div className="result-icon">🚀</div>
                  <div className="result-title">총 수익률</div>
                  <div className="result-value">{(results.returnRate || 0).toFixed(1)}%</div>
                  <div className="result-unit">수익</div>
                </div>
              </div>

              {/* 풍성한 분석 섹션 추가 */}
              <div className="analysis-section">
                <div className="analysis-card">
                  <h3 className="analysis-title">📊 상세 분석 리포트</h3>
                  
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <div className="analysis-icon">⏱️</div>
                      <div className="analysis-content">
                        <h4>투자 기간 분석</h4>
                        <p>납입기간: {paymentPeriod}년</p>
                        <p>대기기간: {Math.max(0, withdrawalStartAge - subscriptionAge - paymentPeriod)}년</p>
                        <p>인출기간: {withdrawalEndAge - withdrawalStartAge}년</p>
                        <p className="highlight">총 운용기간: {withdrawalEndAge - subscriptionAge}년</p>
                      </div>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-icon">💡</div>
                      <div className="analysis-content">
                        <h4>수익성 분석</h4>
                        <p>연평균 수익률: {selectedPlan === 'return' ? '6.5%' : selectedPlan === 'pension' ? '5.5%' : '4.5%'}</p>
                        <p>투자 배수: {((results.totalBenefit || 0) / (results.totalPayment || 1)).toFixed(2)}배</p>
                        <p className="highlight">
                          {results.returnRate > 200 ? '🔥 매우 우수한 수익률!' : 
                           results.returnRate > 100 ? '👍 양호한 수익률' : 
                           '⚠️ 수익률 검토 필요'}
                        </p>
                      </div>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-icon">🎯</div>
                      <div className="analysis-content">
                        <h4>노후 준비 평가</h4>
                        <p>월 생활비 기준: {formatNumber((results.annualWithdrawal || 0) / 12)}/월</p>
                        <p>인플레이션 고려 필요</p>
                        <p className="highlight">
                          {(results.annualWithdrawal || 0) / 12 > 3000 ? '✅ 풍족한 노후 준비' :
                           (results.annualWithdrawal || 0) / 12 > 2000 ? '👌 적절한 노후 준비' :
                           '📈 추가 납입 검토 권장'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recommendation-section">
                  <h3 className="rec-title">🔮 전문가 추천사항</h3>
                  
                  <div className="rec-grid">
                    <div className="rec-card positive">
                      <div className="rec-icon">🎯</div>
                      <h4>해외 장기 저축의 장점</h4>
                      <ul>
                        <li>🌍 <strong>글로벌 분산투자</strong> - 해외 자산으로 안정성 확보</li>
                        <li>🚀 <strong>복리의 마법</strong> - 시간이 지날수록 기하급수적 증가</li>
                        <li>💰 <strong>배당 수익</strong> - 운용 성과에 따른 추가 수익 가능</li>
                        <li>💎 <strong>예상 수익률</strong> - {selectedPlan === 'return' ? '6.5%' : selectedPlan === 'pension' ? '5.5%' : '4.5%'} 목표 연수익</li>
                        <li>🏖️ <strong>유연한 인출</strong> - 원하는 나이부터 연금 수령</li>
                      </ul>
                    </div>

                    <div className="rec-card warning">
                      <div className="rec-icon">🤔</div>
                      <h4>신중히 고려할 점</h4>
                      <ul>
                        <li>💸 <strong>중도 해지시</strong> - 초기 몇 년간은 원금 손실 가능</li>
                        <li>📈 <strong>인플레이션</strong> - 물가 상승률 고려 필요</li>
                        <li>💱 <strong>환율 변동</strong> - USD 기준 상품의 환율 리스크</li>
                        <li>⏰ <strong>장기 투자</strong> - 최소 {paymentPeriod + 5}년 이상 유지 권장</li>
                      </ul>
                    </div>

                    <div className="rec-card suggestion">
                      <div className="rec-icon">🎁</div>
                      <h4>지금 가입하면?</h4>
                      <ul>
                        <li>🔥 <strong>복리 효과 극대화</strong> - 빨리 시작할수록 유리!</li>
                        <li>💪 <strong>안정적 노후</strong> - {withdrawalStartAge}세부터 매년 {formatNumber(results.annualWithdrawal || 0)} 보장</li>
                        <li>🎯 <strong>목표 달성</strong> - 총 {(results.returnRate || 0).toFixed(1)}% 수익률로 성공적 노후 준비</li>
                        <li>⭐ <strong>상품 비교</strong> - {paymentPeriod === 2 ? '5년납과 비교해보세요' : '2년납과 비교해보세요'}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="timeline-section">
                  <h3 className="timeline-title">📅 투자 로드맵</h3>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot start"></div>
                      <div className="timeline-content">
                        <h4>{subscriptionAge}세 - 가입 및 납입 시작</h4>
                        <p>연간 {formatNumber(annualPayment)} 납입</p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-dot middle"></div>
                      <div className="timeline-content">
                        <h4>{subscriptionAge + paymentPeriod}세 - 납입 완료</h4>
                        <p>총 {formatNumber(results.totalPayment || 0)} 납입 완료</p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-dot middle"></div>
                      <div className="timeline-content">
                        <h4>{withdrawalStartAge}세 - 인출 시작</h4>
                        <p>연간 {formatNumber(results.annualWithdrawal || 0)} 인출</p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-dot end"></div>
                      <div className="timeline-content">
                        <h4>{withdrawalEndAge}세 - 해약</h4>
                        <p>해약환급금 {formatNumber(results.surrenderValue || 0)} 수령</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
