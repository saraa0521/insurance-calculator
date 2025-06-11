import Head from 'next/head'
import InsuranceCalculator from '../components/InsuranceCalculator'

export default function Home() {
  return (
    <div>
      <Head>
        <title>스마트 보험 인출 전략 계산기</title>
        <meta name="description" content="해외 장기 저축 플랜으로 미래를 설계하세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InsuranceCalculator />
    </div>
  )
}
