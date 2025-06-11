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
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="w-full flex justify-center">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                스마트 보험 인출 전략 계산기
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                🎯 미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요
              </p>
              <p className="text-lg text-gray-500">
                지금 가입하면 평생 걱정 없는 노후가 시작됩니다! ✨
              </p>
            </div>

            {/* 메인 카드들 */}
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                {/* 연 6.5% 수익률 카드 */}
                <div 
                  className={`bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer ${selectedPlan === 'return' ? 'ring-4 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedPlan('return')}
                >
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-2xl font-bold mb-4">연 6.5% 수익률</h3>
                  <p className="text-lg mb-6">35년 장기 복리 효과 극대화</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold">지금 가입하면 평생 걱정 없는 노후가 시작됩니다!</p>
                  </div>
                </div>

                {/* 평생 연금 카드 */}
                <div 
                  className={`bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer ${selectedPlan === 'pension' ? 'ring-4 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedPlan('pension')}
                >
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold mb-4">평생 연금</h3>
                  <p className="text-lg mb-6">100세까지 안정적인 현금흐름</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold">해약 장기 저축 핵심은 노후가 시작됩니다!</p>
                  </div>
                </div>

                {/* 안전한 투자 카드 */}
                <div 
                  className={`bg-gradient-to-br from-orange-400 to-pink-600 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer ${selectedPlan === 'safe' ? 'ring-4 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedPlan('safe')}
                >
                  <div className="text-6xl mb-4">🛡️</div>
                  <h3 className="text-2xl font-bold mb-4">안전한 투자</h3>
                  <p className="text-lg mb-6">글로벌 보험사의 안전성</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold">지금 가입하면 평생 걱정 없는 노후가 시작됩니다!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 계산 결과 */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">💰 인출 전략 계산기</h2>
                  <p className="text-gray-600">간단한 정보 입력으로 맞춤형 노후 계획을 세워보세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 입력 섹션 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">💵 월 납입금액</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={monthlyPayment}
                          onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                          placeholder="예: 500,000"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">원</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">📅 납입 기간</label>
                      <select 
                        value={paymentPeriod}
                        onChange={(e) => setPaymentPeriod(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                      >
                        <option value="10">10년</option>
                        <option value="15">15년</option>
                        <option value="20">20년</option>
                        <option value="25">25년</option>
                        <option value="30">30년</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">🎂 현재 나이</label>
                      <input 
                        type="number" 
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                        placeholder="예: 35"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">🏖️ 인출 시작 나이</label>
                      <input 
                        type="number" 
                        value={withdrawalAge}
                        onChange={(e) => setWithdrawalAge(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                        placeholder="예: 65"
                      />
                    </div>
                  </div>

                  {/* 결과 섹션 */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 예상 결과</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">총 납입금액</span>
                          <span className="font-bold text-lg text-gray-800">{formatNumber(results.totalPayment || 0)}원</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">65세 예상 적립금</span>
                          <span className="font-bold text-lg text-green-600">{formatNumber(results.accumulated65 || 0)}원</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">월 인출 가능금액</span>
                          <span className="font-bold text-lg text-blue-600">{formatNumber(results.monthlyWithdrawal || 0)}원</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">100세까지 총 수령액</span>
                          <span className="font-bold text-lg text-purple-600">{formatNumber(results.totalReceived || 0)}원</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-4 text-white">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">총 수익률</span>
                          <span className="font-bold text-xl">{(results.returnRate || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추가 정보 */}
                <div className="mt-12 text-center">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 해당 장기 저축 플랜은 단순한 저축이 아닙니다.</h3>
                    <p className="text-lg text-gray-700 mb-4">
                      지금 돈을 시간과 '복리'의 힘을 활용하여, 
                      간단한 인원의 대비 미래 시황으로 실현시키는 구조적 플랜입니다!
                    </p>
                    <p className="text-base text-gray-600">
                      지금 납인의 돈들과 '복리', 
                      간단한 인원의 대비 미래 시황으로 정부지키는 구조적 플랜입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
