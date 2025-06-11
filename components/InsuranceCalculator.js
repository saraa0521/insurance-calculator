import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Shield, DollarSign, Award, Users, Star, Target, Heart, Gift } from 'lucide-react';

const InsuranceCalculator = () => {
  const [inputs, setInputs] = useState({
    company: 'Sun Life',
    product: 'SunJoy Global',
    currentAge: '',
    gender: 'male',
    paymentPeriod: '2',
    totalPremium: '',
    withdrawalStartAge: ''
  });

  const [showResults, setShowResults] = useState(false);

  const companyProducts = {
    'Sun Life': {
      'SunJoy Global': {
        baseRate: 0.0652,
        bonusRate: 0.015,
        surrenderChargeYears: 10,
        minPremium: { '2': 100000, '5': 50000 },
        mortalityBase: 0.0001,
        surrenderRatio: 0.85
      }
    },
    'Chubb Life': {
      'Chubb MyLegacyPlan3': {
        baseRate: 0.0652,
        bonusRate: 0.012,
        surrenderChargeYears: 8,
        minPremium: { '2': 100000, '5': 50000 },
        mortalityBase: 0.0001,
        surrenderRatio: 0.85
      }
    }
  };

  const currentProduct = companyProducts[inputs.company]?.[inputs.product];

  const calculations = useMemo(() => {
    if (!showResults || !inputs.currentAge || !inputs.totalPremium || !inputs.withdrawalStartAge) return null;

    const currentAge = parseInt(inputs.currentAge);
    const totalPremium = parseFloat(inputs.totalPremium);
    const withdrawalStartAge = parseInt(inputs.withdrawalStartAge);

    if (withdrawalStartAge <= currentAge) return null;

    const product = currentProduct;
    if (!product) return null;

    const withdrawalYears = 100 - withdrawalStartAge + 1;
    
    const baseAnnualWithdrawal = 64154;
    const basePremium = 1000000;
    const annualWithdrawal = Math.floor((totalPremium / basePremium) * baseAnnualWithdrawal);
    
    const totalWithdrawn = annualWithdrawal * withdrawalYears;
    
    const baseFinalSurrender = 80633557;
    const finalSurrenderValue = Math.floor((totalPremium / basePremium) * baseFinalSurrender);
    
    const simulationData = [];
    let totalWithdrawnSoFar = 0;
    
    for (let age = withdrawalStartAge; age <= 100; age++) {
      totalWithdrawnSoFar += annualWithdrawal;
      
      const yearsPassed = age - withdrawalStartAge;
      const progressRatio = yearsPassed / withdrawalYears;
      
      let currentSurrenderValue;
      if (age <= 70) {
        currentSurrenderValue = finalSurrenderValue * 0.1 * (1 + progressRatio * 0.5);
      } else if (age <= 80) {
        currentSurrenderValue = finalSurrenderValue * 0.25 * (1 + progressRatio * 0.8);
      } else if (age <= 90) {
        currentSurrenderValue = finalSurrenderValue * 0.5 * (1 + progressRatio * 1.2);
      } else {
        currentSurrenderValue = finalSurrenderValue * (0.8 + progressRatio * 0.2);
      }
      
      simulationData.push({
        age,
        withdrawal: annualWithdrawal,
        totalWithdrawn: Math.floor(totalWithdrawnSoFar),
        surrenderValue: Math.floor(currentSurrenderValue),
        accountValue: Math.floor(currentSurrenderValue * 1.1)
      });
    }

    const totalReturn = totalWithdrawn + finalSurrenderValue;
    const returnRate = ((totalReturn / totalPremium) ** (1 / (100 - currentAge)) - 1) * 100;

    return {
      annualWithdrawal,
      withdrawalYears,
      totalWithdrawn,
      finalSurrenderValue,
      totalReturn,
      returnRate,
      simulationData: simulationData.filter((_, index) => index % 5 === 0 || index === simulationData.length - 1)
    };
  }, [inputs, currentProduct, showResults]);

  const handleInputChange = (field, value) => {
    setInputs(prev => {
      const newInputs = {
        ...prev,
        [field]: value
      };
      
      if (field === 'company') {
        if (value === 'Sun Life') {
          newInputs.product = 'SunJoy Global';
        } else if (value === 'Chubb Life') {
          newInputs.product = 'Chubb MyLegacyPlan3';
        }
      }
      
      return newInputs;
    });
  };

  const handleCalculate = () => {
    if (!inputs.currentAge || !inputs.totalPremium || !inputs.withdrawalStartAge) {
      alert('모든 필수 정보를 입력해주세요!');
      return;
    }
    
    if (parseInt(inputs.withdrawalStartAge) <= parseInt(inputs.currentAge)) {
      alert('인출 시작 나이는 현재 나이보다 커야 합니다.');
      return;
    }

    setShowResults(true);
    
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const pieData = calculations ? [
    { name: '누적 인출금', value: calculations.totalWithdrawn, color: '#3B82F6' },
    { name: '100세 해지환급금', value: calculations.finalSurrenderValue, color: '#10B981' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                스마트 보험 인출 전략 계산기
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              <span className="text-2xl">🎯</span> <strong>미래의 안정적인 노후자금</strong>을 위한 최적의 인출 전략을 찾아보세요
            </p>
            <p className="text-lg text-blue-600 font-semibold">
              <span className="text-xl">✨</span> 지금 가입하면 평생 걱정 없는 노후가 시작됩니다! <span className="text-xl">✨</span>
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <TrendingUp className="w-10 h-10 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">연 6.5% 수익률</h3>
                <p className="text-green-100 text-sm">35년 장기 복리 효과 극대화</p>
                <div className="mt-3 text-2xl">📈</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <Heart className="w-10 h-10 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">평생 연금</h3>
                <p className="text-purple-100 text-sm">100세까지 안정적인 현금흐름</p>
                <div className="mt-3 text-2xl">💰</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <Shield className="w-10 h-10 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">안전한 투자</h3>
                <p className="text-blue-100 text-sm">글로벌 보험사의 안정성</p>
                <div className="mt-3 text-2xl">🛡️</div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  해외 장기 저축 플랜은 단순한 저축이 아닙니다.
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  지금의 돈을 <span className="font-bold text-blue-600">'시간'</span>과 <span className="font-bold text-green-600">'환율'</span>, <span className="font-bold text-purple-600">'복리'</span>라는<br/>
                  강력한 엔진에 태워 미래 자산으로 성장시키는 구조적 플랜입니다.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  🌍 왜 '해외' 장기 플랜인가요?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">1. 금리 차이와 환율 헤지 기회</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>한국보다 높은 복리 수익 구조<br/><span className="text-blue-600 font-semibold">(보통 4~6% 복리 수익 가능)</span></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>USD 자산 보유를 통한 환차익 +<br/>글로벌 분산 자산 효과</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">2. 장기 수익 설계</h4>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4 border-l-4 border-orange-400">
                      <p className="text-gray-700 font-medium italic">
                        "매달 저축만 하고 있다면,<br/>시간은 당신 편이 아닙니다."
                      </p>
                    </div>
                    <p className="text-gray-600">
                      설계된 시간, 예상 가능한 수익,<br/>
                      글로벌 자산화가 준비된<br/>
                      해외 장기 저축 플랜으로<br/>
                      지금부터 <span className="font-bold text-purple-600">'다르게'</span> 시작해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">나만의 맞춤 설계 시뮬레이션</h2>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">무료 체험</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🏢 보험회사</label>
              <select
                value={inputs.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              >
                {Object.keys(companyProducts).map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📋 상품명</label>
              <select
                value={inputs.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              >
                {inputs.company && Object.keys(companyProducts[inputs.company]).map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">👤 현재 나이</label>
              <input
                type="number"
                value={inputs.currentAge}
                onChange={(e) => handleInputChange('currentAge', e.target.value)}
                placeholder="30"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">⚥ 성별</label>
              <select
                value={inputs.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              >
                <option value="male">남성 👨</option>
                <option value="female">여성 👩</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">⏰ 납입기간</label>
              <select
                value={inputs.paymentPeriod}
                onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              >
                <option value="2">2년납</option>
                <option value="5">5년납</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💵 총 납입금액
              </label>
              <input
                type="number"
                value={inputs.totalPremium}
                onChange={(e) => handleInputChange('totalPremium', e.target.value)}
                placeholder="500,000"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🎯 인출 시작 나이</label>
              <input
                type="number"
                value={inputs.withdrawalStartAge}
                onChange={(e) => handleInputChange('withdrawalStartAge', e.target.value)}
                placeholder="65"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-300"
              />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={handleCalculate}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🚀 나만의 미래 설계 시작하기!
            </button>
            <p className="text-gray-500 text-sm mt-2">
              ✨ 단 몇 초만에 평생 노후계획이 완성됩니다
            </p>
          </div>
        </div>

        {calculations && showResults && (
          <div id="results-section" className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">🎉 축하합니다! 이런 놀라운 미래가 기다리고 있어요!</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-100 mb-2">매년 받는 연금</p>
                  <p className="text-4xl font-bold text-yellow-300">${calculations.annualWithdrawal.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm mt-1">{calculations.withdrawalYears}년간 보장!</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-100 mb-2">평생 누적 수령액</p>
                  <p className="text-4xl font-bold text-yellow-300">${calculations.totalWithdrawn.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm mt-1">100세까지 총 수령</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-100 mb-2">상속 가능 금액</p>
                  <p className="text-4xl font-bold text-yellow-300">${calculations.finalSurrenderValue.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm mt-1">자녀에게 물려줄 유산</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300 mb-2">
                  연평균 {calculations.returnRate.toFixed(1)}% 복리 수익률! 🚀
                </p>
                <p className="text-blue-100">
                  💰 총 혜택: <span className="font-bold text-white">${calculations.totalReturn.toLocaleString()}</span>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <Star className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-bold mb-1">연간 인출금액</h3>
                <p className="text-3xl font-bold mb-1">${calculations.annualWithdrawal.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">{calculations.withdrawalYears}년간 매년 ✨</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <TrendingUp className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-bold mb-1">누적 인출금</h3>
                <p className="text-3xl font-bold mb-1">${calculations.totalWithdrawn.toLocaleString()}</p>
                <p className="text-green-100 text-sm">100세까지 총 수령액 💰</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <Shield className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-bold mb-1">100세 해지환급금</h3>
                <p className="text-3xl font-bold mb-1">${calculations.finalSurrenderValue.toLocaleString()}</p>
                <p className="text-purple-100 text-sm">상속 가능 금액 🎁</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <Award className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-bold mb-1">연평균 수익률</h3>
                <p className="text-3xl font-bold mb-1">{calculations.returnRate.toFixed(1)}%</p>
                <p className="text-orange-100 text-sm">복리 기준 연수익률 📈</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📊 나이별 인출 시뮬레이션
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={calculations.simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="age" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(age) => `${age}세`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value/1000000).toFixed(0)}M`} 
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `$${value.toLocaleString()}`, 
                        name === 'accountValue' ? '계좌잔액' : name === 'surrenderValue' ? '해지환급금' : '연간인출'
                      ]}
                      labelFormatter={(age) => `${age}세`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="surrenderValue" 
                      stroke="#10B981" 
                      strokeWidth={4} 
                      name="해지환급금" 
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accountValue" 
                      stroke="#3B82F6" 
                      strokeWidth={4} 
                      name="계좌잔액" 
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🥧 100세 시점 총 혜택 구성
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">연간 인출 계획표 (5년 간격)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">나이</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">연간 인출금</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">누적 인출금</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">계좌 잔액</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">해지환급금</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.simulationData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}>
                        <td className="border border-gray-200 px-4 py-3 font-medium">{row.age}세</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">${row.withdrawal.toLocaleString
                                                                                      ()}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">${row.totalWithdrawn.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">${row.accountValue.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">${row.surrenderValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">이런 안정적인 노후가 기다리고 있습니다!</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-4xl font-bold text-blue-200 mb-2">${calculations.annualWithdrawal.toLocaleString()}</p>
                  <p className="text-blue-100">매년 안정적인 수입</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-200 mb-2">{calculations.withdrawalYears}년간</p>
                  <p className="text-blue-100">평생 보장되는 연금</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-200 mb-2">{calculations.returnRate.toFixed(1)}%</p>
                  <p className="text-blue-100">연평균 복리 수익률</p>
                </div>
              </div>
              <div className="space-y-4">
                <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors text-lg">
                  📞 전문 상담 신청하기
                </button>
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg ml-4">
                  📄 상세 설계서 받기
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                ⭐ 지금 가입하면 특별 혜택까지! 무료 상담으로 나만의 맞춤 설계를 받아보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceCalculator;
