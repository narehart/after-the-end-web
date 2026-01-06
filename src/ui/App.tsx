import useECSInit from '../hooks/useECSInit';
import useInputModeDetection from '../hooks/useInputModeDetection';
import Inventory from './Inventory';
import './App.module.css';

function App(): React.JSX.Element {
  useECSInit();
  useInputModeDetection();

  return <Inventory />;
}

export default App;
