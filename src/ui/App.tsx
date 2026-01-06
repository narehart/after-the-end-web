import useInputModeDetection from '../hooks/useInputModeDetection';
import Inventory from './Inventory';
import './App.module.css';

function App(): React.JSX.Element {
  useInputModeDetection();

  return <Inventory />;
}

export default App;
