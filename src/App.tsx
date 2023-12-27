import React from 'react';
import './styles/App.scss';
import VideoComponment from './VideoComponment';
import HeaderComponment from './HeaderComponment';


function App() {

  React.useEffect(() => {
    console.log('App Mounted.')
    if (!("Notification" in window)) {
      console.log("Browser does not support Desktop Notification");
      return
    } else {
      console.log("Notifications are supported");
    }

    Notification.requestPermission();
  })

  return (
    <div className="App">
      <header className="App-header">
        <HeaderComponment></HeaderComponment>
      </header>
      <div className="App-content">
        <VideoComponment></VideoComponment>

      </div>
    </div>
  );
}

export default App;
