'use client';

const GrantsSection = () => {
  // Array of teams we're seeking grants from
  const teams = [
    { name: 'CTD Foundation', logo: '/CTD.png', description: 'Seeking a grant to showcase our platform on Chain Talk Daily.' },
    { name: 'TUT Foundation', logo: '/tut.jpg', description: 'Collaborating on innovative funding solutions for dreams.' },
    { name: 'BUB Art Collective', logo: '/bub.jpg', description: 'Seeking artistic collaborations to create visuals tailored towards funding dreams on our platform.' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 mb-8 overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-press-start-2p">Partnerships & Grants</h2>
      
      <div className="mb-6 overflow-hidden">
        <p className="text-gray-700 mb-4 text-sm break-words">
          At GoFundDream, we're actively seeking grants and collaborations with successful foundations on the BSC chain. 
          Our goal is to bring more visibility to our project and integrate our platform into their existing ecosystems.
        </p>
        <p className="text-gray-700 mb-4 text-sm break-words font-medium">
          Any team that accepts grants will receive a percentage of our token supply as part of our partnership program.
        </p>
        <p className="text-gray-700 mb-4 text-sm break-words">
          Our key focus areas include:
        </p>
        <ul className="list-disc pl-5 text-gray-700 mb-4 text-sm">
          <li className="mb-2 break-words">Integrating our platform into partner websites</li>
          <li className="mb-2 break-words">Cross-promotion to bring eyes to our BSC-based project</li>
          <li className="mb-2 break-words">Developing joint initiatives on the BSC blockchain</li>
          <li className="mb-2 break-words">Creating sustainable funding mechanisms for dreams</li>
        </ul>
      </div>
      
      <h3 className="text-sm font-semibold text-gray-800 mb-4 font-press-start-2p">Teams We're Seeking Grants From</h3>
      
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
