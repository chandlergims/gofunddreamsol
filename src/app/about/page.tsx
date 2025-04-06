export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-press-start-2p">关于梦想众筹</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              梦想众筹是一个去中心化平台，连接梦想家与支持者。
              我们的使命是通过区块链技术和社区支持，帮助人们为梦想筹集资金并将其变为现实。
            </p>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">运作方式</h2>
            
            <p className="text-gray-700 mb-4">
              梦想众筹利用币安智能链（BSC）技术创建透明、安全和高效的筹资平台。以下是运作方式：
            </p>
            
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
              <li>
                <strong>连接钱包</strong>：使用MetaMask将您的BSC钱包连接到我们的平台。
              </li>
              <li>
                <strong>创建梦想</strong>：通过创建详细的梦想提案，与社区分享您的愿景。
              </li>
              <li>
                <strong>接收资金</strong>：支持者可以直接向您的梦想贡献BNB。
              </li>
              <li>
                <strong>实现梦想</strong>：使用筹集的资金将您的梦想变为现实。
              </li>
            </ol>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">我们的愿景</h2>
            
            <p className="text-gray-700 mb-6">
              我们相信每个人都应该有机会追求自己的梦想。
              通过消除传统筹资障碍，创建梦想家与支持者之间的直接联系，
              我们正在构建一个更具包容性和可访问性的金融生态系统。
            </p>
            
            <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 font-press-start-2p">安全与透明</h2>
            
            <p className="text-gray-700 mb-6">
              梦想众筹上的所有交易都记录在币安智能链（BSC）上，
              确保完全透明和安全。您的钱包是您的身份，
              您始终保持对资金的完全控制。
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h3 className="text-base font-medium text-blue-800 mb-2 font-press-start-2p">加入我们的社区</h3>
              <p className="text-blue-700">
                无论您是寻求支持的梦想家，还是想要帮助他人实现目标的人，
                梦想众筹欢迎您。立即连接您的钱包，成为我们不断壮大的社区的一部分。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
