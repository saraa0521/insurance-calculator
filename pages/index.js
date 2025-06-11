import Head from 'next/head'
import InsuranceCalculator from '../components/InsuranceCalculator'

export default function Home() {
  return (
    <>
      <Head>
        <title>스마트 보험 인출 전략 계산기 - 해외 장기 저축 플랜</title>
        <meta name="description" content="미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요. Sun Life, Chubb Life 상품 지원. 연 6.5% 수익률, 100세까지 안정적인 현금흐름" />
        <meta name="keywords" content="보험계산기, 해외저축, 노후자금, Sun Life, Chubb Life, 연금계산, 인출전략" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://insurance-calculator-mu.vercel.app/" />
        <meta property="og:title" content="스마트 보험 인출 전략 계산기" />
        <meta property="og:description" content="미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://insurance-calculator-mu.vercel.app/" />
        <meta property="twitter:title" content="스마트 보험 인출 전략 계산기" />
        <meta property="twitter:description" content="미래의 안정적인 노후자금을 위한 최적의 인출 전략을 찾아보세요" />
        <meta property="twitter:image" content="/og-image.jpg" />

        {/* 추가 메타 태그 */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Insurance Calculator Team" />
        <meta name="language" content="Korean" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* 프리로드 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "스마트 보험 인출 전략 계산기",
              "description": "해외 장기 저축 플랜을 위한 보험 인출 전략 계산기",
              "url": "https://insurance-calculator-mu.vercel.app/",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>
      
      <main className="w-full min-h-screen">
        <InsuranceCalculator />
      </main>
    </>
  )
}
