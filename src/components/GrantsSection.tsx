'use client';

const GrantsSection = () => {
  // Array of teams we're seeking grants from
  const teams = [
    { name: 'CTD Foundation', logo: '/CTD.png', description: '寻求资助，在Chain Talk Daily上展示我们的平台。' },
    { name: 'TUT Foundation', logo: '/tut.jpg', description: '合作开发创新的梦想资金解决方案。' },
    { name: 'BUB Art Collective', logo: '/bub.jpg', description: '寻求艺术合作，为我们平台上的梦想资金创建定制视觉效果。' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 mb-8 overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-press-start-2p">合作与资助</h2>
      
      <div className="mb-6 overflow-hidden">
        <p className="text-gray-700 mb-4 text-sm break-words">
          在梦想众筹，我们正在积极寻求与BSC链上成功基金会的资助和合作。
          我们的目标是提高项目的知名度，并将我们的平台整合到他们现有的生态系统中。
        </p>
        <p className="text-gray-700 mb-4 text-sm break-words font-medium">
          任何接受资助的团队都将获得我们代币供应的一定比例，作为合作计划的一部分。
        </p>
        <p className="text-gray-700 mb-4 text-sm break-words">
          我们的重点关注领域包括：
        </p>
        <ul className="list-disc pl-5 text-gray-700 mb-4 text-sm">
          <li className="mb-2 break-words">将我们的平台整合到合作伙伴网站</li>
          <li className="mb-2 break-words">交叉推广，为我们基于BSC的项目吸引关注</li>
          <li className="mb-2 break-words">在BSC区块链上开发联合倡议</li>
          <li className="mb-2 break-words">为梦想创建可持续的资金机制</li>
        </ul>
      </div>
      
      <h3 className="text-sm font-semibold text-gray-800 mb-4 font-press-start-2p">我们正在寻求资助的团队</h3>
      
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 overflow-x-hidden">
        {teams.map((team, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex-shrink-0 mr-4">
              <img 
                src={team.logo} 
                alt={`${team.name} Logo`} 
              className={`w-10 h-10 object-cover ${team.logo === '/tut.jpg' || team.logo === '/bub.jpg' ? 'rounded-full' : ''}`} 
              />
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-800">{team.name}</h4>
              <p className="text-sm text-gray-600 break-words">{team.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom section removed as requested */}
    </div>
  );
};

export default GrantsSection;
