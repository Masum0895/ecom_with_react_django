import { useEffect, useState } from "react";

function App(){
  const [message, setMessage] = useState('');
  {/* 
  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/')
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error('Error fetching message:',error));
  }, []);
*/}
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/')  // Added trailing slash
        .then(response => {
            console.log('Status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            setMessage(data.message);
        })
        .catch(error => console.error('Fetch error:', error));
}, []);
  return(
    <div>
      <h1>Message from Backend</h1>
      <p>{message || 'Loading..'}</p>
    </div>
  );
}

export default App;
