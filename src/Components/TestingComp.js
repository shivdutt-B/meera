import React, { useState, useEffect } from 'react';

function TestingComp() {
  // Step 2: Create local state
  const [myState, setMyState] = useState(0);

  // Step 3: Add the effect
  useEffect(() => {
    // This code runs whenever 'myState' changes
    console.log('myState has changed to:', myState);
    
    // Any cleanup can go here (optional)
    return () => {
      console.log('Cleaning up after myState:', myState);
    };
  }, [myState]); // 'myState' is added to the dependency array

  return (
    <div>
      <p>Current value: {myState}</p>
      <button onClick={() => setMyState(myState + 1)}>Increment</button>
    </div>
  );
}

export default TestingComp;
