import React,{useState} from 'react';
import { PageHOC ,CustomInput,CustomButton} from '../components';
import { useGlobalContext } from '../context';
const Home = () => {
  const {contract, walletAddress,setshowAlert} = useGlobalContext();
  const [playerName, setplayerName] = useState('');

  const handleClick= async ()=>{
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      if(!playerExists){
        await contract.registerPlayer(playerName,playerName)
        setshowAlert({
          status:true,
          type:'info',
          message:`${playerName} is being summoned !`
        })
      }
    } catch (error) {
      setshowAlert({
        status:true,
        type:'failure',
        message:"something went wrong"
      })
    }
  }
  return (
    <div className='flex flex-col'>
      <CustomInput
      label="Name"
      placeholder="Enter your name"
      value={playerName}
      handleValueChange={setplayerName}/>
      
     <CustomButton
     title="Register"
     handleClick={handleClick}
     restStyles="mt-6"
     />

    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br/> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br/> the ultimate Web3 Battle Card Game</>
);