export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-press-start-2p">About GoFundDream</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              GoFundDream is a decentralized platform that connects dreamers with supporters. 
              Our mission is to help people fund their dreams and turn them into reality through 
              the power of blockchain technology and community support.
            </p>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">How It Works</h2>
            
            <p className="text-gray-700 mb-4">
              GoFundDream leverages Binance Smart Chain (BSC) technology to create a transparent, 
              secure, and efficient funding platform. Here's how it works:
            </p>
            
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
              <li>
                <strong>Connect Your Wallet</strong>: Use MetaMask to connect your BSC wallet to our platform.
              </li>
              <li>
                <strong>Create a Dream</strong>: Share your vision with the community by creating a detailed dream proposal.
              </li>
              <li>
                <strong>Receive Funding</strong>: Supporters can contribute BNB directly to your dream.
              </li>
              <li>
                <strong>Make It Happen</strong>: Use the funds to bring your dream to life.
              </li>
            </ol>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">Our Vision</h2>
            
            <p className="text-gray-700 mb-6">
              We believe that everyone deserves the opportunity to pursue their dreams. 
              By removing traditional barriers to funding and creating a direct connection 
              between dreamers and supporters, we're building a more inclusive and 
              accessible financial ecosystem.
            </p>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">Security & Transparency</h2>
            
            <p className="text-gray-700 mb-6">
              All transactions on GoFundDream are recorded on the Binance Smart Chain (BSC), 
              ensuring complete transparency and security. Your wallet is your identity, 
              and you maintain full control of your funds at all times.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-base font-medium text-blue-800 mb-2 font-press-start-2p">Join Our Community</h3>
              <p className="text-blue-700">
                Whether you're a dreamer looking for support or someone who wants to help 
                others achieve their goals, GoFundDream welcomes you. Connect your wallet 
                today and become part of our growing community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
