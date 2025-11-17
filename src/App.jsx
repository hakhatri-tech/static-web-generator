
import './layout.css'
import './App.css'
import { useState } from 'react'
import ComponentSelector from './components/component-selector';
import Left from './components/left';
import Center from './components/center';
import Right from './components/right';

function App() {


  const [selectedId, setSelectedId] = useState(null);

  

  return (
    <div className='layout'>

      
      <Left></Left>

     
      <Center selectedId={selectedId} setSelectedId={setSelectedId}></Center>

      
      <div className='right'>
        <Right></Right>
      </div>



    </div>

  )
}


export default App
